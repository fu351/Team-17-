"use strict";
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const app = express();
const port = 3000;

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: '', // Replace with your desired AWS region
});

const docClient = new AWS.DynamoDB.DocumentClient();

app.set('view engine', 'ejs');

app.get('/upload-form', (req, res) => {
  // Query DynamoDB to get the list of uploaded files
  const params = {
      TableName: 'package_storage_1', // Replace with your DynamoDB table name
      ProjectionExpression: 's3ObjectKey', // Replace with the appropriate attribute name
  };

  docClient.scan(params, (err, data) => {
      if (err) {
          console.error('Error querying DynamoDB:', err);
          res.status(500).json({ error: 'An error occurred while retrieving file list' });
      } else {
          const uploadedFiles = data.Items.map(item => item.s3ObjectKey);
          res.render('upload-form', { uploadedFiles });
      }
  });
});

const s3 = new AWS.S3();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

app.use(express.static('views'));

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const uploadedFile = req.file;

    // Upload the file to S3
    const s3Params = {
      Bucket: 'clistoragetestbucket',
      Key: `uploads/${uploadedFile.originalname}`,
      Body: uploadedFile.buffer,
    };
    const uploadResult = await s3.upload(s3Params).promise();

    // Save the metadata to DynamoDB
    const params = {
      TableName: 'package_storage_1',
      Item: {
        ngPACKAGE: name,
        packageDescription: description,
        s3ObjectKey: `uploads/${uploadedFile.originalname}`,
      },
    };

    docClient.put(params, (err) => {
      if (err) {
        console.error('Error saving metadata to DynamoDB:', err);
        res.status(500).json({ error: 'An error occurred while uploading the package' });
      } else {
        // Package and metadata were successfully saved
        res.status(201).json({
          message: 'Package uploaded successfully',
          s3Url: uploadResult.Location 
        });
      }
    });
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

app.post('/update', (req, res) => {
  const packageIdToUpdate = req.body.packageId; // Get the unique identifier of the package to update
  const updatedName = req.body.name; // Get the updated package name
  const updatedDescription = req.body.description; // Get the updated package description

  // You can use packageIdToUpdate to identify the package in your DynamoDB

  // Example code to update the package in DynamoDB
  const params = {
    TableName: 'package_storage_1',
    Key: {
        ngPACKAGE: packageIdToUpdate,
    },
    UpdateExpression: 'SET packageDescription = :description, s3ObjectKey = :key',
    ExpressionAttributeValues: {
        ':description': updatedDescription,
        ':key': `uploads/${updatedName}.zip`,
    },
};


  docClient.update(params, (err) => {
      if (err) {
          console.error('Error updating package:', err);
          res.status(500).json({ error: 'An error occurred while updating the package' });
      } else {
          // Package information was successfully updated
          res.redirect('/upload-form'); // Redirect to the page where the update form is located
      }
  });
});


// A simple route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is up and running.');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

