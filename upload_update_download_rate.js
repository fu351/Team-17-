const { fetchGitHubInfo } = require('./npm-github-netscore');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const AdmZip = require('adm-zip');
const { log } = require('console');
const router = express.Router();
const port = 3000;
const token = "";

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
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
    Key: `logs/${packageMetadata.name}/${date}.json`,
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

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const uploadedFile = req.file;

    console.log('Validating zip contents...');
    if (!validateZipContents(uploadedFile.buffer, uploadedFile.originalname)) {
      console.log('Validation failed.');
      return res.status(400).json({ error: 'The zip file must contain a package.json file.' });
    }

    console.log('Validation passed. Uploading to S3...');

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
    
    // Extract homepage from package.json
    const homepage = packageJson.homepage;
    const called = packageJson.name;
    const zip_ver = packageJson.version;
    console.log(homepage);
    console.log(called);

    const scores = await fetchGitHubInfo(homepage, token);

    if (scores[1] < 0.5) {
      console.log('Package Net Score too low, ingestion blocked.');
      return res.status(400).json({ error: 'Package Net Score too low, ingestion blocked.' });
    }
    //Extract the readme from the zip file
    const readmeEntry = zipEntries.find(entry => entry.entryName.toLowerCase().includes('readme.md'));
    const readme = zip.readAsText(readmeEntry);

    //create randomized 7 digit packageID
    const packageID = Math.floor(Math.random() * 9000000) + 1000000;
    // Continue with the upload process
    const s3Params = {
      Bucket: 'clistoragetestbucket',
      Key: `uploads/${uploadedFile.originalname}`,
      Body: uploadedFile.buffer.toString('base64'),
      Metadata: {
        NetScore: scores[1].toString(),
        Version: zip_ver.toString(),
        Ramp_Up: scores[2],
        Correctness: scores[3],
        Bus_Factor: scores[4],
        Responsive_Maintainer: scores[5],
        License_Score: scores[6],
        Dependency_Score: scores[7],
        Reviewed_Code_Score: scores[8],
        PopularityScore: scores[10],
        packageId: packageID,
        readme: readme,
      }
    };
    await s3.upload(s3Params).promise();
    //logging upload action for traceability
    const user = {name: 'default', isAdmin: 'true'};
    const packageMetadata = { Name: s3Params.Key, Version: s3Params.Metadata.Version, ID: s3Params.Metadata.packageID };
    logAction(user, 'UPLOAD', packageMetadata); // Log the upload action
  } catch (error) {
    console.error('Error uploading package:', error);
    res.status(500).json({ error: 'An error occurred while uploading the package' });
  }
});


router.get('/download', async (req, res) => {
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

router.post('/update', async (req, res) => {
  const { Name, Version, ID } = req.body.metadata;
  const { Content } = req.body.data;
  //const updatedDescription = req.body.description;

  try {
    // Example code to get the current version number from S3 metadata
    const s3uploadParams = {
      Bucket: 'clistoragetestbucket',
      Key: `uploads/${Name}.zip`, // Use the appropriate key
      Body: Content,
      metadata: {
        Version: Version,
        packageID: ID,
      },
    };

    await s3.upload(s3UploadParams).promise();
    
    //Logging update action for traceability
    const user = {name: 'default', isAdmin: 'true'};
    const packageMetadata = { Name: s3UploadParams.Key, Version: s3UploadParams.Metadata.Version, ID: s3UploadParams.Metadata.packageID };
    logAction(user, 'UPDATE', packageMetadata); // Log the upload action

    res.status(200).json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'An error occurred while updating the package' });
  }
});

router.get('/rate/:packageId', async (req, res) => {
  const packageId = req.params.packageId;

  try {
    // Example code to get the relevant metadata from S3
    const s3HeadParams = {
      Bucket: 'clistoragetestbucket',
      Key: `uploads/${packageId}.zip`, // Use the appropriate key
    };

    const s3ObjectMetadata = await s3.headObject(s3HeadParams).promise();
    
    // Extract relevant metadata
    const netScore = s3ObjectMetadata.Metadata.NetScore; 
    const ramp_up = s3ObjectMetadata.Metadata.Ramp_Up;
    const correctness = s3ObjectMetadata.Metadata.Correctness;
    const bus_factor = s3ObjectMetadata.Metadata.Bus_Factor;
    const responsive_maintaner = s3ObjectMetadata.Metadata.Responsive_Maintainer;
    const license = s3ObjectMetadata.Metadata.License_Score;
    const dependency = s3ObjectMetadata.Metadata.Dependency_Score;
    const reviewed_code = s3ObjectMetadata.Metadata.Reviewed_Code_Score;


    // Add more metadata variables as needed

    // Display the relevant metadata
    res.status(200).json({
      packageId,
      netScore,
      ramp_up,
      correctness,
      bus_factor,
      responsive_maintaner,
      license,
      dependency,
      reviewed_code,
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