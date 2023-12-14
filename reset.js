"use strict";

const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2', // Replace with your desired AWS region
});

router.delete('/reset', (req, res) => {
    const s3 = new AWS.S3();
    const bucketName = '461testbucket'; // Replace with your S3 bucket name
    
    try {
        // List all objects in the bucket
        const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    
        // Check if there are any objects in the bucket
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
        console.error('Error emptying S3 bucket:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
    
module.exports = router;
