"use strict";
const express = require('express');
const router = express.Router();





//Get the package from the s3 bucket with the corresponding packageID and return the contents of the package
router.get('/package/{id}', (req, res) => {
    const packageID = req.body.packageID;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
        Metadata: {
            packageID: packageID
        },
        MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
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
        Bucket: 'package-storage-1', //replace with bucket name
        Prefix: `logs/${packageName}/`,
        MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const logs = [];

        for (const item of data.Contents) {
            const objectParams = {
                Bucket: params.Bucket,
                Key: item.Key,
            };

            const objectData = await s3.getObject(objectParams).promise();
            const log = JSON.parse(objectData.Body.toString());
            logs.push(log);
        }

        res.status(200).json({ data: logs });
    } catch (err) {
        console.error('Error retrieving logs from S3:', err);
        res.status(500).json({ error: 'Error retrieving logs from S3' });
    }
});
//Search for a package using regular expression over package names and READMEs. Return the packages if the package name or the README matches the regular expression
router.get('/package/byRegEx', async (req, res) => {
    const regEx = req.body.regEx;
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
        MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
    };
    //access the readme file and search for the regular expression
    try {
        const data = await s3.listObjectsV2(params).promise();
        const matchedPackages = [];

        for (const item of data.Contents) {
            const metadataParams = {
                Bucket: params.Bucket,
                Metadata: {
                    packageID: item.Metadata.Version,
                }
                
            };

            const metadata = await s3.headObject(metadataParams).promise();
            const readme = metadata.Metadata.readme;

            if (regEx.test(item.Key) || regEx.test(readme)) {
                const [Name, Version] = [item.Key, item.Metadata.Version];
                matchedPackages.push({ Name, Version });
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
    const params = {
        Bucket: 'package-storage-1', //replace with bucket name
        StartAfter: offset, // Start listing after the package name
        MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
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

module.exports = router;