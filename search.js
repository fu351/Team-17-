"use strict";
const express = require('express');
const router = express.Router();
const AdmZip = require('adm-zip');
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2', // Replace with your desired AWS region
  });
const s3 = new AWS.S3();
const storage = multer.memoryStorage();

//Get the package from the s3 bucket with the corresponding packageID and return the contents of the package
router.get('/package/{id}', (req, res) => {
    const packageID = req.params.id;
    const params = {
        Bucket: 'testingfunctionality', //replace with bucket name
        key : packageID,
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
router.get('/package/byName', async (req, res) => {
    const packageName = req.body.packageName;
    const params = {
        Bucket: 'testingfunctionality', //replace with bucket name
        Prefix: `logs/${packageName}/`,
        MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
    };

    try {
        // Get the logs from S3 and return them
        const data = await s3.listObjectsV2(params).promise();
        const promises = data.Contents.map(async (item) => {
            const params = {
                Bucket: 'testingfunctionality', //replace with bucket name
                Key: item.Key
            };
            const logData = await s3.getObject(params).promise();
            return JSON.parse(logData.Body.toString('utf-8'));
        });
        const logs = await Promise.all(promises);
        res.status(200).json(logs);
    } catch (err) {
        console.error('Error retrieving logs from S3:', err);
        res.status(500).json({ error: 'Error retrieving logs from S3' });
    }
});
//Search for a package using regular expression over package names and READMEs. Return the packages if the package name or the README matches the regular expression
router.post('/package/byRegEx', async (req, res) => {
    //get the regular expression from the body
    const regEx = req.body.regEx;
    const params = {
        Bucket: 'testingfunctionality', //replace with bucket name
        Prefix: `packages/`,
    };
    //access the readme file and search for the regular expression
    try {
        const data = await s3.listObjectsV2(params).promise();
        const matchedPackages = [];
        for (const item of data.Contents) {
            const metadataParams = {
                Bucket: params.Bucket,
                key : item.Key,
            };

            const object = await s3.getObject(metadataParams).promise();
            if (regEx.test(object.Metadata.Name)) {
                const [Name, Version] = [object.Metadata.Name, object.Metadata.Version];
                matchedPackages.push({ Name, Version });
            }
            else {
            const zip = new AdmZip(object.Body.buffer);
            const zipEntries = zip.getEntries();
            const readmeEntry = zipEntries.find(entry => entry.entryName.toLowerCase().includes('readme.md'));
            const readme = readmeEntry ? readmeEntry.getData().toString('utf8') : '';
            
                if (regEx.test(readme)) {
                    const [Name, Version] = [object.Metadata.Name, object.Metadata.Version];
                    matchedPackages.push({ Name, Version });
                }
            }

        }

        res.status(200).json({ data: matchedPackages });
    } catch (err) {
        console.error('Error retrieving files from S3:', err);
        res.status(500).json({ error: 'Error downloading files from S3' });
    }
});

router.post('/packages', async (req, res) => {
    const packageName = req.body.packageName;
    const versionInput = req.body.version;
    const offset = req.query.offset || 0; // Get the offset from the query parameters, default to 0
    
    try {

        if (!packageName) {
            throw new Error('Package name is required');
        }
        if (packageName == "*") {
            const params = {
                Bucket: 'testingfunctionality', //replace with bucket name
                Prefix: `packages/`,
                StartAfter: offset, // Start listing after the package name
                MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
            }; 
            const data = await s3.listObjectsV2(params).promise();
            const matchedPackages = [];
            for (const item of data.Contents) {
                const metadataParams = {
                    Bucket: 'testingfunctionality',
                    Key: item.Key,
                };
                const metadata = await s3.headObject(metadataParams).promise();
                const [Name, Version] = [metadata.Metadata.Name, metadata.Metadata.Version, metadata.Metadata.ID];
                matchedPackages.push({ Name, Version });
            }

        }
        else {
            const params = {
                Bucket: 'testingfunctionality', //replace with bucket name
                Prefix: `packages/`,
                StartAfter: offset, // Start listing after the package name
                MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
                
            }; 
            const data = await s3.listObjectsV2(params).promise();
            const matchedPackages = [];

            for (const item of data.Contents) {
                const metadataParams = {
                    Bucket: params.Bucket,
                    Key: item.Key,
                };
                const metadata = await s3.headObject(metadataParams).promise();
                const version = metadata.Metadata.version;
                if (metadata.Metadata.Name == packageName) {
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
    
        }
        res.status(200).json({ data: matchedPackages });
    } catch (err) {
        console.error('Error retrieving files from S3:', err);
        res.status(500).json({ error: 'Error downloading files from S3' });
    }
});

module.exports = router;