const AWS = require('aws-sdk');
const fs = require('fs');

// Set your AWS credentials and S3 bucket information
const accessKeyId = '';
const secretAccessKey = '';
const bucketName = '';
const region = 'us-east-1';
const directoryPrefix = ''; // Replace with the actual directory path

// Create an S3 instance
const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

// Set the parameters for the S3 listObjects request
const listParams = {
  Bucket: bucketName,
  Prefix: directoryPrefix,
};

// Use the listObjects method to list all objects in the specified "directory"
s3.listObjects(listParams, (listErr, listData) => {
    if (listErr) {
      console.error('Error listing objects:', listErr);
    } else {
      // Process the list of objects
      const logFiles = listData.Contents.map(obj => obj.Key);
      const logContents = []; // Array to store log content
  
      // Read each log file
      logFiles.forEach(logFile => {
        const readParams = {
          Bucket: bucketName,
          Key: logFile,
        };
  
        s3.getObject(readParams, (readErr, readData) => {
          if (readErr) {
            console.error('Error reading log file:', readErr);
          } else {
            // Process the log file content
            const logContent = readData.Body.toString('utf-8');
            logContents.push(logContent);
            
            // If this is the last log file, display the array
            if (logContents.length === logFiles.length) {
              console.log('Log contents:', logContents);
            }
          }
        });
      });
    }
  });