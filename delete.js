"use strict";
const express = require('express');
const AWS = require('aws-sdk');
const app = express();

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-2', // Replace with your desired AWS region
  });


const s3 = new AWS.S3();

app.use(express.json());
app.use(express.static('views'));

//delete specific package from s3 bucket based on packageID
app.delete('/package/{id}', (req, res) => {
    const packageID = req.body.packageID;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
        Key: {
            packageID: packageID
        } 
    };
    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.error('Error deleting file from S3:', err);
            res.status(500).json({ error: 'Error deleting file from S3' });
        } else {
            res.status(200).json({ data });
        }
    });
});

//delete every version of a package in the s3 bucket that matches the package name
app.delete('/package/byName/{name}', (req, res) => {
    const packageName = req.body.packageName;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
        Key: {
            packageName: packageName
        } 
    };
    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.error('Error deleting file from S3:', err);
            res.status(500).json({ error: 'Error deleting file from S3' });
        } else {
            res.status(200).json({ data });
        }
    });
}); 