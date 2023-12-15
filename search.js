"use strict";
const express = require('express');
const router = express.Router();
const AdmZip = require('adm-zip');
const AWS = require('aws-sdk');
const { version } = require('winston');
const semver = require('semver');
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_Key_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_Key,
    region: 'us-east-2', // Replace with your desired AWS region
  });
const s3 = new AWS.S3();
//Get the package from the s3 bucket with the corresponding packageID and return the contents of the package
router.get('/package/:id', (req, res) => {
    console.log('search by ID happening');
    //console.log(process.env.AWS_ACCESS_Key_ID, process.env.AWS_SECRET_ACCESS_Key)
    const packageID = req.params.id;
    const xauth = req.headers['x-authorization'];
    if (!packageID) {
        return res.status(400).json({ error: 'Missing package ID' });
    }
    /* if (xauth != "0") {
        return res.status(400).json({ error: 'You do not have permission to download the package.' });
    } */
    if (!xauth) {
        return res.status(400).json({ error: 'Missing AuthenticationToken' });
    }
    const params = {
        Bucket: '461testbucket', //replace with bucket name
        Key : `packages/${packageID}.zip`,
    };
    console.log(params);
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) {
                console.error('Error retrieving file from S3:', err);
                res.status(500).json({ error: 'Error downloading file from S3' });
                reject(err);
            } else {
                console.log({ 
                    metadata:{
                        Name: data.Metadata.name,
                        Version: data.Metadata.version,
                        ID: data.Metadata.id,
                        
                        },
                    data: {
                        Content: data.Body.toString('base64'),
                    }
                })
                res.status(200).json({ 
                    metadata:{
                        Name: data.Metadata.name,
                        Version: data.Metadata.version,
                        ID: data.Metadata.id,
                        },
                    data: {
                        Content: data.Body.toString('base64'),
                        JSProgram: "holder",
                    }
                });
                resolve();
            }
        });
    });
});
//search the s3 bucket for the file based on just the package name and return the history of the package including the actions done to it
router.get('/package/byName/:name', async (req, res) => {
    console.log('search by name happening');
    const packageName = req.params.name;
    const xAuth = req.headers['x-authorization'];
    if (!xAuth) {
        return res.status(400).json({ error: 'Missing AuthenticationToken' });
    }
    if (!packageName) {
        return res.status(400).json({ error: 'Missing package name' });
    }
    const params = {
        Bucket: '461testbucket', //replace with bucket name
        Prefix: `logs/${packageName}/`,
        MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
    };
    try {
        console.log(params);
        // Get the logs from S3 and return them
        const data = await s3.listObjectsV2(params).promise();
        const promises = data.Contents.map(async (item) => {
            const params = {
                Bucket: '461testbucket', //replace with bucket name
                Prefix: `logs`,
                Key: item.key
            };
            const logData = await s3.getObject(params).promise();
            return JSON.parse(logData.Body.toString('utf-8'));
        });
        const logs = await Promise.all(promises);
        console.log(logs);
        res.status(200).json(logs);
    } catch (err) {
        console.error('Error retrieving logs from S3:', err);
        res.status(500).json({ error: 'Error retrieving logs from S3' });
    }
});
//Search for a package using regular expression over package names and READMEs. Return the packages if the package name or the README matches the regular expression
router.post('/package/byRegEx', async (req, res) => {
    console.log('search by regex happening');
    //get the regular expression from the body
    const regEx =  new RegExp(req.body.regEx);
    const xAuth = req.headers['x-authorization'];
    if (!xAuth || !regEx) {
        return res.status(400).json("There is missing field(s) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.");
    }
    const params = {
        Bucket: '461testbucket', //replace with bucket name
        Prefix: `packages/`,
    };
    //access the readme file and search for the regular expression
    try {
        const data = await s3.listObjectsV2(params).promise();
        const matchedPackages = [];
        for (const item of data.Contents) {
            const metadataParams = {
                Bucket: params.Bucket,
                Key : item.Key,
            };
            const object = await s3.getObject(metadataParams).promise();
            if (regEx.test(object.Metadata.Name)) {
                const objectdata = {};
                    objectdata.Name = object.Metadata.name;
                    objectdata.Version = object.Metadata.version;
                    //objectdata.Popularity = object.Metadata.popularity;
                    matchedPackages.push(objectdata);
            }
            else {
            const zip = new AdmZip(object.Body.buffer);
            const zipEntries = zip.getEntries();
            const readmeEntry = zipEntries.find(entry => entry.entryName.toLowerCase().includes('readme.md'));
            const readme = readmeEntry ? readmeEntry.getData().toString('utf8') : '';
                if (regEx.test(readme)) {
                    const objectdata = {};
                    objectdata.Name = object.Metadata.name;
                    objectdata.Version = object.Metadata.version;
                    //objectdata.Popularity = object.Metadata.popularity;
                    matchedPackages.push(objectdata);
                }
            }
        }
        if (matchedPackages.length === 0) {
            return res.status(404).json("No packages found. Please try again.");
        }
        console.log(matchedPackages);
        res.status(200).json(matchedPackages);
    } catch (err) {
        console.error('Error retrieving files from S3:', err);
        res.status(500).json({ error: 'Error downloading files from S3' });
    }
});
router.post('/packages', async (req, res) => {
    console.log('getting registry');
    const matchedPackages = [];
    if (!req.body) {
        console.log('error1');
        return res.status(400).json("Missing package name");
    }
    const xAuth = req.headers['X-authorization'];
    // if (!xAuth) {
    //     console.log('error2');
    //     return res.status(400).json("Missing AuthenticationToken");
    // }
    for (const req_query of req.body ){
        const packageName = req_query.Name;
        console.log(req_query);
        console.log(req.body);
        const versionInput = req_query.Version;
        const offset = req.query.offset || "";  //offset is optional
        if (offset < 0) {
            console.log('error3');
            return res.status(400).json("Offset must be greater than or equal to 0.");
        }
        try {
            if (!packageName) {
                throw new Error('Package name is required');
            }
            if (packageName == "*") {
                const params = {
                    Bucket: '461testbucket', //replace with bucket name
                    Prefix: `packages/`,
                    StartAfter: offset, // Start listing after the package name
                    MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
                }; 
                const data = await s3.listObjectsV2(params).promise();
                
                for (const item of data.Contents) {
                    const metadataParams = {
                        Bucket: '461testbucket',
                        Key: item.Key,
                    };
                    const metadata = await s3.headObject(metadataParams).promise();
                    //json object to be returned
                    const objectdata = {};
                    objectdata.Version = versionInput || metadata.Metadata.version;
                    objectdata.Name = metadata.Metadata.name;
                    objectdata.ID = metadata.Metadata.id;
                   // objectdata.Popularity = metadata.Metadata.popularity;
                    if (versionInput) {
                        if (versionInput.includes('-')) {
                            const versionRange = versionInput.split('-').map(semver.clean);
                            if (semver.gte(version, versionRange[0]) && semver.lte(version, versionRange[1])) {
                                matchedPackages.push(data);
                            }
                        } else if (versionInput.startsWith('~') || versionInput.startsWith('^')) {
                            if (semver.satisfies(version, versionInput)) {
                                matchedPackages.push(objectdata);
                            }
                        } else if (version === semver.clean(versionInput)) {
                            matchedPackages.push(objectdata);
                        }
                    } else {
                        matchedPackages.push(objectdata);
                    }
                    if (matchedPackages.length >= 100) {
                        console.log('error4');
                        return res.status(413).json("Too many packages returned.");
                    }
                }
            }
            else {
                const params = {
                    Bucket: '461testbucket', //replace with bucket name
                    Prefix: `packages/`,
                    StartAfter: offset, // Start listing after the package name
                    MaxKeys: 100, // Return a maximum of 100 packages, prevents DOS attacks
                    
                }; 
                const data = await s3.listObjectsV2(params).promise();
                for (const item of data.Contents) {
                    const metadataParams = {
                        Bucket: params.Bucket,
                        Key: item.Key,
                    };
                    const metadata = await s3.headObject(metadataParams).promise();
                    const version = metadata.Metadata.version;
                    //json object to be returned
                    const objectdata = {};
                    objectdata.Version = versionInput || metadata.Metadata.version;
                    objectdata.Name = metadata.Metadata.name;
                    objectdata.ID = metadata.Metadata.id;
                    //objectdata.Popularity = metadata.Metadata.popularity;
                    if (metadata.Metadata.Name == packageName) {
                        if (versionInput) {
                            if (versionInput.includes('-')) {
                                const versionRange = versionInput.split('-').map(semver.clean);
                                if (semver.gte(version, versionRange[0]) && semver.lte(version, versionRange[1])) {
                                    matchedPackages.push(objectdata);
                                }
                            } else if (versionInput.startsWith('~') || versionInput.startsWith('^')) {
                                if (semver.satisfies(version, versionInput)) {
                                    matchedPackages.push(objectdata);
                                }
                            } else if (version === semver.clean(versionInput)) {
                                matchedPackages.push(objectdata);
                            }
                            
                        } else{
                            matchedPackages.push(objectdata);
                        }
                    }
                    if (matchedPackages.length >= 100) {
                        console.log('error5');
                        return res.status(413).json("Too many packages returned.");
                    }
                }
            }
            if (matchedPackages.length === 0) {
                console.log('error6');
                return res.status(404).json("No packages found. Please try again.");
            }
        } catch (err) {
            console.error('Error retrieving files from S3:', err);
            res.status(500).json({ error: 'Error downloading files from S3' });
        }
    }
    console.log(matchedPackages);
    res.status(200).json(matchedPackages);
});
module.exports = router;