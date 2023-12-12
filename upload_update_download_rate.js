const { fetchGitHubInfo } = require('./npm-github-netscore');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const AdmZip = require('adm-zip');
const { log } = require('console');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const port = 3000;
require('dotenv').config();
const token = process.env.GITHUB_TOKEN;


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2', // Replace with your desired AWS region
});

const s3 = new AWS.S3();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const logAction = async (user, action, packageMetadata) => {
  const date = new Date().toISOString();
  const logObject = {
    User: user,
    Date: date,
    PackageMetadata: packageMetadata,
    Action: action,
  };
  const params = {
    Bucket: 'clistoragetestbucket',
    Key: `logs/${packageMetadata.name}/${date}`,
    Body: JSON.stringify(logObject),
  };
  try {
    await s3.putObject(params).promise();
  } catch (err) {
    console.error('Error logging action to S3:', err);
  }
};

const validateZipContents = (zipBuffer, zipFileName) => {
  const expectedPackageJsonPath = `${zipFileName.replace(/\..+$/, '')}/package.json`.toLowerCase();

  const zip = new AdmZip(zipBuffer);
  const zipEntries = zip.getEntries();

  // Check if there's an entry with the expected path 'name-of-file/package.json'
  const hasPackageJson = zipEntries.some(entry => entry.entryName.toLowerCase() === expectedPackageJsonPath);

  return hasPackageJson;
};

router.post('/package', upload.single('file'), async (req, res) => { //upload package
  try {
    const packageData = req.body;
    console.log(packageData);
    let content = packageData.Content;
    
    if (!packageData) {
      console.log('No package data uploaded.');
      return res.status(400).json({ error: 'No package data uploaded' });
    }
    if (packageData.Content != NULL & packageData.URL != NULL) { 
      return res.status(400).json({error: 'Both content and URL were set'});
    }
    if (packageData.Content == NULL & packageData.URL == NULL) {
      return res.status(400).json({error: 'Neither content nor URL were set'});
    }

    let homepage = "";
    let packageName = "";
    let zip_ver = "";
    
    //Handles if the package is uploaded via URL
    //Retrieves the zip file of the package from the URL
    if (packageData.URL != NULL){
      homepage = packageData.URL;
      const {user, repo} = await extractGitHubInfo(homepage);
      const url = `https://api.github.com/repos/${user}/${repo}/zipball`;
      axious ({
        method: 'get',
        url: url,
        headers: {
          Authorization: `token ${token}`,
        },
        responseType: 'arraybuffer',
      })
      .then(function (response) {
        content = Buffer.from(response.data, 'binary').toString('base64');
    })
  }
    const base64Data = Buffer.from(content, 'base64');
    const uploadedFile = {
      buffer: base64Data,
      tempname: 'package.zip',
    };

    if (!validateZipContents(uploadedFile.buffer, uploadedFile.tempname)) {
      console.log('Validation failed.');
      return res.status(400).json({ error: 'The zip file must contain a package.json file.' });
    }

    // Read and parse package.json content
    const zip = new AdmZip(uploadedFile.buffer);
    const zipEntries = zip.getEntries();
    const packageJsonEntry = zipEntries.find(entry => entry.entryName.toLowerCase().includes('package.json'));

    if (!packageJsonEntry) {
      console.log('Package.json not found in zip file.');
      return res.status(400).json({ error: 'Package.json not found in the zip file.' });
    }

    //Get all info from package.json
    const packageJsonContent = zip.readAsText(packageJsonEntry);
    const packageJson = JSON.parse(packageJsonContent);
    
    // Extract homepage, name and version from package.json
    //Set homepage if it was not set before
    if (homepage == null) {
      const githubUrlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$)/i;
      //go through json file and find url to github repo based on regex
      for (const key in packageJson) {
        if (packageJson.hasOwnProperty(key)) {
          const element = packageJson[key];
          if (typeof element === 'string' && githubUrlPattern.test(element)) {
            homepage = element;
            break;
          }
        }
      }
    }

    packageName = packageJson.name;
    zip_ver = packageJson.version;
    if(homepage == null|| packageName == null || zip_ver == null)  {
      console.log(homepage, called, zip_ver);
      console.log('package.json must contain repository url, package name, and version');
      return res.status(400).json({ error: 'package.json must contain repository url, package name, and version'});
    }
    
    
    const scores = await fetchGitHubInfo(homepage, token);
    //console.log(scores);
    if (scores == null) {
      console.log('Invalid Repository URL');
      return res.status(400).json({ error: 'Invalid Repository URL'});
    }

    if (scores[1] < 0.5) { //check for ingestion
      console.log('Package Net Score too low, ingestion blocked.');
      return res.status(424).json({ error: 'Package not uploaded due to rating' });
    }
    // Create a unique package ID that includes the name and version
    const packageID = `${packageName}-${zip_ver}`;
    //check if package exists already
    const packageExistsParams = {
      Bucket: 'testingfunctionality',
      Key: `packages/${packageID}.zip`,
    };

    try {
      s3.headObject(packageExistsParams).promise();
      return res.status(409).json({error: 'Package exists already'});
    } catch (headObjectError) {
      //if the package does nto exist continue with upload
      if (headObjectError.code != 'NotFound') {
        console.log('something went wrong');
      }
    }

    

    
    // Continue with the upload process
    const s3Params = {
      Bucket: 'testingfunctionality',
      Key: `packages/${packageID}.zip`,
      data: {content: content},
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
        Name: packageJson.name,
        Version: zip_ver.toString(),
        ID: packageID
      }
    };


    try  { //upload complete, answer with response codes
      await s3.upload(s3Params).promise();
      //package was uploaded succesfully
      const responseBody = {
        metadata: {
          Name: called,
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
      const packageMetadata = { Name: s3Params.Metadata.Name, Version: s3Params.Metadata.Version, ID: s3Params.Metadata.packageID };
      logAction(user, 'UPLOAD', packageMetadata); // Log the upload action
      
      return res.status(201).json({responseBody});
    } catch (error) {
      console.error(error);
    }
    
  } catch (error) {
    return res.status(400)('Error uploading package:', error);
  }
});


router.get('/download', async (req, res) => { //download package (might need to work on this one)
  const selectedPackage = req.query.package; // Get the selected package name
  const params = {
    Bucket: 'clistoragetestbucket', 
    Key: `${selectedPackage}`, // Use the selected package name to generate the object key
    Expires: 60 * 5, // The URL will expire in 60 seconds, Security
  };

  const downloadUrl = s3.getSignedUrl('getObject', params);

  //Get object metadata for logging
  const objectData = await s3.getObject(params).promise();
  const metadata = objectData.Metadata;
  const version = metadata.version;
  const id = metadata.packageId;
  const user = {name: 'default', isAdmin: 'true'};
  const packageMetadata = { Name: selectedPackage, Version: version, ID: id };
  //logging download action for traceability
  logAction(user, 'DOWNLOAD', packageMetadata); // Log the upload action

  // Redirect the user to the pre-signed URL
  res.redirect(downloadUrl);
});

router.put('/package/{id}', async (req, res) => { //update package
  const { Name, Version, ID } = req.body.metadata;
  const { Content, URL } = req.body.data;
  if(Name == NULL || Version == NULL || ID == NULL || Content == NULL || URL == NULL) { //need all fields to be present
    return res.status(400).json({error: 'There are missing fields in the Request Body'});
  }

  //Next check that name, version, and ID match
  try {
    const existingPackageParams = {
      Bucket: 'holder',
      Key: `packages/${ID}.zip`,
    };
    
    let existingMetaData;
    try {
      const existingPackage = await s3.headObject(existingPackageParams).promise();
      existingMetaData = existingPackage.Metadata;
    } catch (headObjectError) {
      if (headObjectError.code == 'NotFound') {
        return res.status(404).json({ error: 'Package does not exist'});
      } else {
        console.log('update error');
      }
    }

    if(existingMetaData.Version != Version || existingMetaData.packageId != ID || existingMetaData.Name != Name) {
      return res.status(400).json({ error: 'Invalid name, ID, or Version'});
    }
  } catch (error) {

  }

  const s3uploadparams = { //replace old content with the new content
    Bucket: 'holder',
    Key: `packages/${ID}.zip`,
    Body: Content,
  };

  try {
    await s3.upload(s3uploadparams).promise(); //upload package with new data content

    //Logging update action for traceability
    const user = {name: 'default', isAdmin: 'true'};
    const packageMetadata = { Name: s3UploadParams.Key, Version: s3UploadParams.Metadata.Version, ID: s3UploadParams.Metadata.packageID };
    logAction(user, 'UPDATE', packageMetadata); // Log the upload action

    res.status(200).json({ message: 'Version is updated' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'An error occurred while updating the package' });
  }
});

router.get('/package/{id}/rate', async (req, res) => { //rate package
  const packageId = req.params.Id;
  //There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid. return 400 error
  if (!packageId) {
    return res.status(400).json({ error: 'Missing PackageID' });
  }
  try {
    // Example code to get the relevant metadata from S3
    const s3HeadParams = {
      Bucket: 'clistoragetestbucket',
      Key: `packages/${packageId}.zip`, // Use the appropriate key
    };

    const s3ObjectMetadata = await s3.headObject(s3HeadParams).promise();
    //if the package is not in the bucket, return 404 error
    if (!s3ObjectMetadata) {
      return res.status(404).json({ error: 'Package does not exist' });
    }
    // Extract URL and Rate the package
    const URL = s3ObjectMetadata.Metadata.URL;
    const score = fetchGitHubInfo(URL, token);
    const NetScore = score[1];
    const RampUp = score[2];
    const Correctness = score[3];
    const BusFactor = score[4];
    const ResponsiveMaintainer = score[5];
    const LicenseScore = score[6];
    const GoodPinningPractice = score[7];
    const PullRequest = score[8];
 
    // Display the relevant metadata
    res.status(200).json({
      "BusFactor": BusFactor,
      "Correctness": Correctness,
      "Rampup": RampUp,
      "ResponsiveMaintainer": ResponsiveMaintainer,
      "LicenseScore": LicenseScore,
      "GoodPinningPractice": GoodPinningPractice,
      "PullRequest": PullRequest,
      "NetScore": NetScore,
    });

    //logging Rate action for traceability
    const user = {name: 'default', isAdmin: 'true'};
    const packageMetadata = { Name: s3ObjectMetadata.Key, Version: s3ObjectMetadata.Metadata.Version, ID: s3ObjectMetadata.Metadata.packageID };
    logAction(user, 'RATE', packageMetadata); // Log the upload action
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