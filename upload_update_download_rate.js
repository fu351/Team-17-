const { fetchGitHubInfo, extractGitHubInfo } = require('./npm-github-netscore');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const AdmZip = require('adm-zip');
const { log } = require('console');
const router = express.Router();
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const semver = require('semver');
const { json } = require('stream/consumers');



const token = process.env.GITHUB_TOKEN;


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2', // Replace with your desired AWS region
});
AWS.config.logger = console;
const s3 = new AWS.S3();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const logAction = async (user, action, name, version, id) => {
  const date = new Date().toISOString();
  const logObject = {
    User: user,
    Date: date,
    PackageMetadata: {
      Name: name,
      Version: version,
      ID: id,
    },
    Action: action,
  };
  const params = {
    Bucket: '461testbucket',
    Key: `logs/${name}/${date}`,
    Body: JSON.stringify(logObject),
  };
  try {
    await s3.putObject(params).promise();
  } catch (err) {
    console.error('Error logging action to S3:', err);
  }
};

const isPackageJsonThere = (zipBuffer) => {
  const zip = new AdmZip(zipBuffer);
  const zipEntries = zip.getEntries();
  const packageJsonEntry = zipEntries.find(entry => entry.entryName.toLowerCase().includes('package.json'));
  return Boolean(packageJsonEntry);
};
const findGitHubUrl = (object)  => {
  const githubUrlPattern = /:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$)/i;
  for (const key in object) {
    if (typeof object[key] === 'string' && githubUrlPattern.test(object[key])) {
      let url = object[key];
      // Remove any existing protocol
      url = url.replace(/^[a-z]*:/, '');
      // Ensure the URL uses the https protocol
      url = 'https:' + url;
      // Split the URL by '/' and join the first four elements
      url = url.split('/').slice(0, 4).join('/');
      return url;
    } else if (typeof object[key] === 'object' && object[key] !== null) {
      const result = findGitHubUrl(object[key]);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
router.post('/package', upload.single('file'), async (req, res) => { //upload package
  console.log('pcakage upload/ingestion being used');
  try {
    const packageData = req.body;
    let content = packageData.Content;
    if (!packageData) {
      console.log('No package data uploaded.');
      return res.status(400).json({ error: 'No package data uploaded' });
    }
    if (packageData.Content & packageData.URL) { 
      console.log('Both content and URL were set.');
      return res.status(400).json({error: 'Both content and URL were set'});
    }
    if (!packageData.Content & !packageData.URL) {
      console.log('Neither content nor URL were set.');
      return res.status(400).json({error: 'Neither content nor URL were set'});
    }

    let homepage = "";
    let packageName = "";
    let zip_ver = "";
    
    //Handles if the package is uploaded via URL
    //Retrieves the zip file of the package from the URL
    if (packageData.URL){
      console.log('\x1b[34m%s\x1b[0m', 'URL was set.');
      console.log('URL was set.');
      homepage = packageData.URL;
      let githubInfo;
      try {
         githubInfo = await extractGitHubInfo(homepage);
      } catch (error) {
        console.log(error);
      }
      console.log(githubInfo);
      if (!githubInfo.username || !githubInfo.repository) {
        console.log('Invalid Repository URL');
        return res.status(400).json({ error: 'Invalid Repository URL'});
      }
      const url = `https://api.github.com/repos/${githubInfo.username}/${githubInfo.repository}/zipball`;
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      };
      try {
        const response = await fetch(url, { headers });
        const fileStream = fs.createWriteStream(`${githubInfo.repository}.zip`);
        await new Promise((resolve, reject) => {
          response.body.pipe(fileStream);
          response.body.on("error", (err) => {
            reject(err);
          });
          fileStream.on("finish", function () {
            resolve();
          });
        });
        // Read the zip file into a buffer
        const zipBuffer = fs.readFileSync(`${githubInfo.repository}.zip`);
        // Convert the buffer to a base64 string
        content = zipBuffer.toString('base64');
       
      } catch (error) {
        console.log('Error downloading package:');
        
        console.log(error);
        //process.exit(1);
      }
    }
    else {
      console.log('\x1b[34m%s\x1b[0m', 'Content was set.');
    }
    //console.log(content);
    const decodedData = Buffer.from(content, 'base64');



    // Read and parse package.json content
    const zip = new AdmZip(decodedData);
    const zipEntries = zip.getEntries();
    // Sort the entries by their depth to ensure that the package.json file is found on the first level
    const sortedEntries = zipEntries.sort((a, b) => {
      const depthA = a.entryName.split('/').length;
      const depthB = b.entryName.split('/').length;
      return depthA - depthB;
    });
    if (!isPackageJsonThere(decodedData)) {
      console.log('Validation failed.');
      return res.status(400).json({ error: 'The zip file must contain a package.json file.' });
    }
    const packageJsonEntry = sortedEntries.find(entry => entry.entryName.toLowerCase().includes('package.json'));

    if (!packageJsonEntry) {
      console.log('Package.json not found in zip file.');
      return res.status(400).json({ error: 'Package.json not found in the zip file.' });
    }

    //Get all info from package.json
    const packageJsonContent = zip.readAsText(packageJsonEntry);
    const packageJson = JSON.parse(packageJsonContent);
    
    
    // Extract URL, name and version from package.json
    //Set URL if it was not set before
    if (!homepage) {
      if (packageJson.homepage) {
        homepage = packageJson.homepage;
      }
      else {
      homepage = findGitHubUrl(packageJson);
      }
    }
    console.log("home",homepage);
    packageName = packageJson.name;
    //remove any / from the package name
    packageName = packageName.replace(/\//g, '');
    zip_ver = (packageJson.version).toString();
    //if zip_ver not a string then convert it to a string
    if (typeof zip_ver != 'string') {
      zip_ver = zip_ver.toString();
    }
    //check that the version is a valid semver
    zip_ver = semver.coerce(zip_ver);
    if(!homepage || !packageName || !zip_ver )  {
      console.log(packageJsonEntry.entryName)
      console.log(packageJson)
      console.log('homepage: ' + homepage + ' packageName: ' + packageName + ' zip_ver: ' + zip_ver);
      console.log('package.json must contain repository url, package name, and version');
      return res.status(400).json({ error: 'package.json must contain repository url, package name, and version'});
    }
    
    console.log("adsfsadf")
    const scores = await fetchGitHubInfo(homepage, token);
    console.log("scores", scores);
    //console.log(scores);
    if (!scores) {
      console.log('Invalid Repository URL');
      return res.status(400).json({ error: 'Invalid Repository URL'});
    }
    for (let i = 1; i <= 8; i++) {
      const score = scores[i];
      if (score < 0.5 || isNaN(score)) { //check for ingestion
        console.log('Package Net Score too low, ingestion blocked.');
        console.log(scores);
        //return res.status(424).json({ error: 'Package not uploaded due to rating' });
      }
    }
    // Create a unique package ID that includes the name and version
    const packageID = `${packageName}-${zip_ver}`;
    //check if package exists already
    const packageExistsParams = {
      Bucket: '461testbucket',
      Key: `packages/${packageID}.zip`,
    };

    try {
      await s3.headObject(packageExistsParams).promise();
      return res.status(409).json({error: 'Package exists already'});
    } catch (headObjectError) {
      //if the package does nto exist continue with upload
      if (headObjectError.code != 'NotFound') {
        console.log('something went wrong');
        //console.log(headObjectError);
      }
    }

    
    console.log(scores);
    
    // Continue with the upload process
    const s3Params = {
      Bucket: '461testbucket',
      Key: `packages/${packageID}.zip`,
      Body: content,
      Metadata: {
        NetScore: scores[1].toString(),
        Ramp_Up: scores[2].toString(),
        Correctness: scores[3].toString(),
        Bus_Factor: scores[4].toString(),
        Responsive_Maintainer: scores[5].toString(),
        License_Score: scores[6].toString(),
        Dependency_Score: scores[7].toString(),
        Reviewed_Code_Score: scores[8].toString(),
        PopularityScore: scores[9].toString(),
        URL: homepage,
        Name: packageName,
        Version: zip_ver.toString(),
        ID: packageID
      }
    };


    try  { //upload complete, answer with response codes
      await s3.upload(s3Params).promise();
    } catch (error) {
      console.error(error);
    }
    //package was uploaded succesfully
    const responseBody = {
      metadata: {
        Name: packageJson.name,
        Version: zip_ver.toString(),
        ID: packageID.toString(),
      },
      data: {
        Content: content,
        JSProgram: 'holder',
      }
    };
    //logging upload action for traceability
    const user = {name: 'default', isAdmin: 'true'};
    logAction(user, 'UPLOAD', packageName, zip_ver.toString(), packageID); // Log the upload action
    
    console.log(responseBody);
    return res.status(201).json(responseBody);
  } catch (error) {
    console.log('Error uploading package:', error);
    return res.status(400).json({ message: 'Error uploading package:'});
  }
});

//Download Package Endpoint
//Assuming that the package will be based on the package ID and will be a path parameter
router.get('/download/:id', async (req, res) => { //download package from bucket
  const ID = req.params.id; // Get the selected package name
  const params = {
    Bucket: '461testbucket', 
    Key: `packages/${ID}.zip`, // Use the selected package name to generate the Object key
    Expires: 60 * 5, // The URL will expire in 60 seconds, Security
  };

  const downloadUrl = s3.getSignedUrl('getObject', params);
  if (!downloadUrl) {
    return res.status(404).json({ error: 'Package does not exist' });
  }
  //Get Object metadata for logging
  const ObjectData = await s3.getObject(params).promise();
  const metadata = ObjectData.Metadata;
  const version = metadata.version;
  const id = metadata.packageId;
  const user = {name: 'default', isAdmin: 'true'};
  //logging download action for traceability
  logAction(user, 'DOWNLOAD',  metadata.name, version.toString(), id); // Log the upload action

  // Redirect the user to the pre-signed URL
  res.redirect(downloadUrl);
  return res.status(200).json('Package is downloaded' );
});

router.put('/package/:id', async (req, res) => { //update package
  console.log('package update being used');
  const packageId = req.params.id;
  const { Name, Version, ID } = req.body.metadata;
  let { Content, URL } = req.body.data;
  if(!Name || !Version  || !ID || (!Content & !URL) || !packageId || (Content & URL)) { //need all fields to be present
    return res.status(400).json({error: 'There are missing fields in the Request Body'});
  }
  if (packageId != ID) { //check that the package ID matches the ID in the URL
    return res.status(400).json({error: 'The package ID does not match the ID in the URL'});
  }


  //Next check that name, version, and ID match
  try {
    const existingPackageParams = {
      Bucket: '461testbucket',
      Key: `packages/${ID}.zip`,
    };
    
    let existingMetaData;
    const existingPackage = await s3.headObject(existingPackageParams).promise();
    if (!existingPackage) {
      return res.status(404).json({ error: 'Package does not exist' });
    }
    existingMetaData = existingPackage.Metadata;


    if(existingMetaData.version != Version || existingMetaData.id != ID || existingMetaData.name != Name) {
      return res.status(400).json({ error: 'Invalid name, ID, or Version'});
    }
  } catch (error) {
    console.error('Error retrieving package metadata:', error);
    res.status(404).json({ error: 'An error occurred while retrieving package metadata' });
  }
  if (URL) { //if the URL is set, download the package from the URL
      console.log('URL was set.');
      let githubInfo;
      try {
         githubInfo = await extractGitHubInfo(URL);
      } catch (error) {
        console.log(error);
      }
      console.log(githubInfo);
      if (!githubInfo.username || !githubInfo.repository) {
        console.log('Invalid Repository URL');
        return res.status(400).json({ error: 'Invalid Repository URL'});
      }
      const url = `https://api.github.com/repos/${githubInfo.username}/${githubInfo.repository}/zipball`;
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      };
      try {
        const response = await fetch(url, { headers });
        const fileStream = fs.createWriteStream(`${githubInfo.repository}.zip`);
        await new Promise((resolve, reject) => {
          response.body.pipe(fileStream);
          response.body.on("error", (err) => {
            reject(err);
          });
          fileStream.on("finish", function () {
            resolve();
          });
        });
        // Read the zip file into a buffer
        const zipBuffer = fs.readFileSync(`${githubInfo.repository}.zip`);
        // Convert the buffer to a base64 string
        Content = zipBuffer.toString('base64');
       
      } catch (error) {
        console.log('Error downloading package:');
        
        console.log(error);
        //process.exit(1);
      }
    }
  
  const s3uploadparams = { //replace old content with the new content
    Bucket: '461testbucket',
    Key: `packages/${ID}.zip`,
    Body: Content,
  };

  try {
    await s3.upload(s3uploadparams).promise(); //upload package with new data content

    //Logging update action for traceability
    const user = {name: 'default', isAdmin: 'true'};
    logAction(user, 'UPDATE', Name, Version,ID); // Log the upload action
    console.log('Version is updated');
    res.status(200).json('Version is updated');
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'An error occurred while updating the package' });
  }
});

router.get('/package/:id/rate', async (req, res) => { //rate package
  console.log('package rate being used');
  const packageId = req.params.id;
  console.log("ID",packageId);
  //There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid. return 400 error
  if (!packageId) {
    return res.status(400).json({ error: 'Missing PackageID' });
  }
  try {
    // Example code to get the relevant metadata from S3
    const s3HeadParams = {
      Bucket: '461testbucket',
      Key: `packages/${packageId}.zip`, // Use the appropriate key
    };

    const s3ObjectMetadata = await s3.headObject(s3HeadParams).promise();
    //if the package is not in the bucket, return 404 error
    if (!s3ObjectMetadata) {
      return res.status(404).json({ error: 'Package does not exist' });
    }
    // Extract URL and Rate the package
    const URL = s3ObjectMetadata.Metadata.url;
    if (!URL) {
      console.log('\x1b[33m%s\x1b[0m', "no URL");
    }
    console.log('\x1b[33m%s\x1b[0m', URL);
    const score = await fetchGitHubInfo(URL, token);
    console.log('Score successfully been calculated');
    const NetScore = score[1];
    const RampUp = score[2];
    const Correctness = score[3];
    const BusFactor = score[4];
    const ResponsiveMaintainer = score[5];
    const LicenseScore = score[6];
    const GoodPinningPractice = score[7];
    const PullRequest = score[8];
 
    

    //logging Rate action for traceability
    const user = {name: 'default', isAdmin: 'true'};
    logAction(user, 'RATE', s3ObjectMetadata.Metadata.name, s3ObjectMetadata.Metadata.version, s3ObjectMetadata.Metadata.id); // Log the upload action
    // Display the relevant metadata
    // console.log(json({
    //   "BusFactor": BusFactor,
    //   "Correctness": Correctness,
    //   "Rampup": RampUp,
    //   "ResponsiveMaintainer": ResponsiveMaintainer,
    //   "LicenseScore": LicenseScore,
    //   "GoodPinningPractice": GoodPinningPractice,
    //   "PullRequest": PullRequest,
    //   "NetScore": NetScore,
    // }));
    return res.status(200).json({
      "BusFactor": BusFactor,
      "Correctness": Correctness,
      "Rampup": RampUp,
      "ResponsiveMaintainer": ResponsiveMaintainer,
      "LicenseScore": LicenseScore,
      "GoodPinningPractice": GoodPinningPractice,
      "PullRequest": PullRequest,
      "NetScore": NetScore,
    });
  } catch (error) {
    console.error('Error retrieving package metadata:', error);
    res.status(500).json({ error: 'An error occurred while retrieving package metadata' });
  }
});

// A simple route to check if the server is running
router.get('/', (req, res) => {
  
  res.send('Server is up and running.');
});

module.exports = router;