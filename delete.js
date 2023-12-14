"use strict";

const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2', // Replace with your desired AWS region
  });


const s3 = new AWS.S3();


//delete specific package from s3 bucket based on packageID
router.delete('/package/{id}', (req, res) => {
    const packageID = req.params.id;
    const params = {
        Bucket: '461testbucket', //replace with bucket name
        Key: `packages/${packageID}.zip`,
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
router.delete('/package/byName/{name}', (req, res) => {
    const packageName = req.params.name;
    const params = {
        Bucket: '461testbucket', //replace with bucket name
        prefix: `packages/`,
        Metdata: {
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
module.exports = router;