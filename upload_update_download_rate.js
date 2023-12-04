"use strict";
const { fetchGitHubInfo } = require('./npm-github-netscore');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const AdmZip = require('adm-zip');
const app = express();
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

const validateZipContents = (zipBuffer, zipFileName) => {
  const expectedPackageJsonPath = `${zipFileName.replace(/\..+$/, '')}/package.json`.toLowerCase();

  const zip = new AdmZip(zipBuffer);
  const zipEntries = zip.getEntries();

  // Check if there's an entry with the expected path 'name-of-file/package.json'
  const hasPackageJson = zipEntries.some(entry => entry.entryName.toLowerCase() === expectedPackageJsonPath);

  return hasPackageJson;
};

app.post('/upload', upload.single('file'), async (req, res) => {
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

    // Continue with the upload process
    const s3Params = {
      Bucket: 'clistoragetestbucket',
      Key: `uploads/${uploadedFile.originalname}`,
      Body: uploadedFile.buffer,
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
        //PopularityScore: 40,
        //packageId: 
        //readme:
        //history:  
      }
    };

    await s3.upload(s3Params).promise();

  } catch (error) {
    console.error('Error uploading package:', error);
    res.status(500).json({ error: 'An error occurred while uploading the package' });
  }
});


app.get('/download', (req, res) => {
  const selectedPackage = req.query.package; // Get the selected package name
  const params = {
    Bucket: 'clistoragetestbucket', 
    Key: `${selectedPackage}`, // Use the selected package name to generate the object key
  };

  const downloadUrl = s3.getSignedUrl('getObject', params);

  // Redirect the user to the pre-signed URL
  res.redirect(downloadUrl);
});

app.post('/update', async (req, res) => {
  const packageIdToUpdate = req.body.packageId;
  const updatedName = req.body.name;
  //const updatedDescription = req.body.description;

  try {
    // Example code to get the current version number from S3 metadata
    const s3HeadParams = {
      Bucket: 'clistoragetestbucket',
      Key: `uploads/${updatedName}.zip`, // Use the appropriate key
    };

    const s3ObjectMetadata = await s3.headObject(s3HeadParams).promise();
    const currentVersion = parseInt(s3ObjectMetadata.Metadata.Version) || 0;

    // Increment the version number
    const newVersion = currentVersion + 1;

    // Continue with the S3 upload process
    const s3UploadParams = {
      Bucket: 'clistoragetestbucket',
      Key: `uploads/${updatedName}_v${newVersion}.zip`,
      Body: packageIdToUpdate.buffer,
      Metadata: {
        Version: newVersion.toString(),
        // Add other metadata key-value pairs as needed
      },
    };

    await s3.upload(s3UploadParams).promise();

    res.status(200).json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'An error occurred while updating the package' });
  }
});

app.get('/rate/:packageId', async (req, res) => {
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
  } catch (error) {
    console.error('Error retrieving package metadata:', error);
    res.status(500).json({ error: 'An error occurred while retrieving package metadata' });
  }
});

// A simple route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is up and running.');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
