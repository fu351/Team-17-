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
router.delete('/package/:id', (req, res) => {
    const packageID = req.params.id;
    const xauth = req.headers['x-authorization'];
    /* if (xauth != "0") {
      return res.status(400).json({error: 'Invalid Authentication Token'});
    } */
    if (!xauth) {
        return res.status(400).json({error: 'Missing Authentication Token'});
      }
      if (!packageID) {
        return res.status(400).json({error: 'Missing PackageID'});
      }
    const params = {
        Bucket: '461testbucket', //replace with bucket name
        Key: `packages/${packageID}.zip`,
    };
    s3.deleteObject(params, (err, data) => {
        if (err) {
            if (err.code === 'NoSuchKey') {
                res.status(404).json({ error: 'Package does not exist' });
            } else {
                console.error('Error deleting file from S3:', err);
                res.status(500).json({ error: 'Error deleting file from S3' });
            }
        } else {
            res.status(200).json('Package is deleted.');
        }
    });
});

//delete every version of a package in the s3 bucket that matches the package name
router.delete('/package/byName/:name', (req, res) => {
    const packageName = req.params.name;
    const xauth = req.headers['x-authorization'];
    if (xauth != "0" || !xauth) { //need all fields to be present
        return res.status(400).json({error: 'There are missing fields in the Request Body'});
    }
    if ( !packageName || !xauth) {
        return res.status(400).json('There is missing field(s) in the PackageName/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.');
    }
    const params = {
        Bucket: '461testbucket', //replace with bucket name
        Prefix: `packages/${packageName}`
    };
    
    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error('Error listing objects from S3:', err);
            res.status(404).json({ error: 'Error listing objects from S3' });
        } else {
            const deleteParams = {
                Bucket: params.Bucket,
                Delete: {
                    Objects: data.Contents.map(content => ({ Key: content.Key }))
                }
            };
            s3.deleteObjects(deleteParams, (err, data) => {
                if (err) {
                    console.error('Error deleting files from S3:', err);
                    res.status(404).json({ error: 'Error deleting files from S3' });
                } else {
                    res.status(200).json('Package is deleted.');
                }
            });
        }
    });
    return res.status(200).json('Package is deleted.');
}); 
module.exports = router;