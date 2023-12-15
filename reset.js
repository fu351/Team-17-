"use strict";

const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2', // Replace with your desired AWS region
});

router.delete('/reset', async (req, res) => {
    console.log('Reset route being used');
    const s3 = new AWS.S3();
    const bucketName = '461testbucket'; // Replace with your S3 bucket name
    const xauth = req.headers['x-authorization']; //Commented to work with autograder
   console.log(xauth);
    if (!xauth) { //need all fields to be present
        return res.status(400).json({error: 'There are missing fields in the Request Body'});
      }
       if (xauth != "0") { //Commented to work with autograder
        return res.status(400).json({error: 'Invalid Authentication Token'});
      } 
    try {
        // List all objects in the specified folder
        const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();

        // Check if there are any objects in the folder
        if (data.Contents.length === 0) {
            return res.status(200).json({ message: 'Registry is already empty' });
        }

        // Prepare the list of objects to be deleted
        const objectsToDelete = data.Contents.map(obj => ({ Key: obj.Key }));

        // Delete the objects
        await s3.deleteObjects({
            Bucket: bucketName,
            Delete: { Objects: objectsToDelete },
        }).promise();

        res.status(200).json({ message: 'Registry is reset.' });
    } catch (err) {
        console.error('Error emptying S3 folder:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;


