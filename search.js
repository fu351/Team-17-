"use strict";
const express = require('express');
const multer = require('multer');
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

//Get the package from the s3 bucket with the corresponding packageID and return the contents of the package
app.get('/package/{id}', (req, res) => {
    const packageID = req.body.packageID;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
        Key: {
            packageID: packageID
        } 
    };
    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error retrieving file from S3:', err);
            res.status(500).json({ error: 'Error downloading file from S3' });
        } else {
            res.status(200).json({ data });
        }
    });
});


//search the s3 bucket for the file based on just the package name and return the history of the package including the actions done to it
app.get('/package/byName', (req, res) => {
    const packageName = req.body.packageName;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
        Key: {
            packageName: packageName
        } 
    };
    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error retrieving file from S3:', err);
            res.status(500).json({ error: 'Error downloading file from S3' });
        } else {
            res.status(200).json({ data });
        }
    });
});
//Search for a package using regular expression over package names and READMEs. Return the packages if the package name or the README matches the regular expression
app.get('/package/byRegEx', (req, res) => {
    const regEx = req.body.regEx;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
        Key: {
            packageName: regEx,
            readMe: regEx
        } 
    };
    //access the readme file and search for the regular expression
    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error retrieving file from S3:', err);
            res.status(500).json({ error: 'Error downloading file from S3' });
        } else {
            res.status(200).json({ data });
        }
    });
});
