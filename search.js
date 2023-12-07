"use strict";
const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const semver = require('semver');



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
        Metadata: {
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
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const matchedPackages = data.Contents.filter(item => item.Key === packageName);

        res.status(200).json({ data: matchedPackages });
    } catch (err) {
        console.error('Error retrieving files from S3:', err);
        res.status(500).json({ error: 'Error downloading files from S3' });
    }
});
//Search for a package using regular expression over package names and READMEs. Return the packages if the package name or the README matches the regular expression
app.get('/package/byRegEx', (req, res) => {
    const regEx = req.body.regEx;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
    };
    //access the readme file and search for the regular expression
    try {
        const data = await s3.listObjectsV2(params).promise();
        const matchedPackages = [];

        for (const item of data.Contents) {
            const metadataParams = {
                Bucket: params.Bucket,
                Key: item.Key,
            };

            const metadata = await s3.headObject(metadataParams).promise();
            const readme = metadata.Metadata.readme;

            if (regEx.test(item.Key) || regEx.test(readme)) {
                matchedPackages.push(item);
            }
        }

        res.status(200).json({ data: matchedPackages });
    } catch (err) {
        console.error('Error retrieving files from S3:', err);
        res.status(500).json({ error: 'Error downloading files from S3' });
    }
});

app.post('/packages', (req, res) => {
    const packageName = req.body.packageName;
    const versionInput = req.body.version;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const matchedPackages = [];

        for (const item of data.Contents) {
            if (item.Key === packageName) {
                const metadataParams = {
                    Bucket: params.Bucket,
                    Key: item.Key,
                };

                const metadata = await s3.headObject(metadataParams).promise();
                const version = metadata.Metadata.version;

                if (versionInput.includes('-')) {
                    const versionRange = versionInput.split('-').map(semver.clean);
                    if (semver.gte(version, versionRange[0]) && semver.lte(version, versionRange[1])) {
                        matchedPackages.push(item);
                    }
                } else if (versionInput.startsWith('~') || versionInput.startsWith('^')) {
                    if (semver.satisfies(version, versionInput)) {
                        matchedPackages.push(item);
                    }
                } else if (version === semver.clean(versionInput)) {
                    matchedPackages.push(item);
                }
            }
        }

        res.status(200).json({ data: matchedPackages });
    } catch (err) {
        console.error('Error retrieving files from S3:', err);
        res.status(500).json({ error: 'Error downloading files from S3' });
    }
});
app.get('/directory', (req, res) => {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 100;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
        MaxKeys: pageSize,
        ContinuationToken: pageNumber > 1 ? String(pageNumber) : undefined,
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        res.status(200).json({ data });
    } catch (err) {
        console.error('Error retrieving files from S3:', err);
        res.status(500).json({ error: 'Error downloading files from S3' });
    }
});
