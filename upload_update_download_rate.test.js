//npm install jest supertest --save-dev
// run by npx jest upload_update_download_rate.test.js
const request = require('supertest');
const app = require('./upload_update_download_rate'); // Import your app or server
const httpMocks = require('node-mocks-http');
const fs = require('fs');
/*
describe('POST /package', () => {
  // test cases1 upload a file
   it('should upload a zip file', async () => {
    const fileBuffer = fs.readFileSync('underscore-master.zip', 'base64'); // replace with your file path  
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/package',
      body: {
          Content: fileBuffer,
      },
    });
    const res = httpMocks.createResponse();
    try {
      await app(req, res);
    } catch (error) {
      console.log(error);
    }
    expect(res.statusCode).toBe(201);
  }); 
 /// test cases1.1 upload a file
   it('should upload a url', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/package',
      body: {
          URL: 'https://github.com/lobehub/lobe-chat/',
      },
    });
    const res = httpMocks.createResponse();
    await app(req, res);
    expect(res.statusCode).toBe(201);
  });
  
  // test cases2 upload fail with no file provided
  it('should fail when no file is provided', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/package',
      // add any other properties you need on req, like req.body
    });
    const res = httpMocks.createResponse();
    await app(req, res);
  // now you can make assertions about the response
    expect(res.statusCode).toBe(400);
  
  });

  
  // test cases3 upload fail with no body provided
  it('should fail with no file body provided', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/package',
      file: {
          buffer: '',
          originalname: '',
          name: '',
      },
    });
    const res = httpMocks.createResponse();
    expect(res.statusCode).toBe(200);
    await app(req, res);

  }); // Add a closing curly brace here
}); 
*/

/* describe('GET /package/{id}/rate', () => {
  it('rate a file with an working id', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: `/package/underscore-1.13.6/rate`,
      params: {
        id: "underscore-1.13.6",
      },
  });
  const res = httpMocks.createResponse();
  await app(req, res);
  // now you can make assertions about the response
  console.log(res._getData());
  expect(res.statusCode).toBe(200);
  });
  it('rate a file with an working id', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: `/package/@lobehubchat-0.111.4/rate`,
      params: {
        id: "@lobehubchat-0.111.4",
      },
  });
  const res = httpMocks.createResponse();
  await app(req, res);
  // now you can make assertions about the response
  console.log(res._getData());
  expect(res.statusCode).toBe(200);
  });
}); */


describe('GET /package/{id}', () => {
  //test the update function
  it('should update a file with an working id', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: `/package/underscore-1.13.6`,
      params: {
        id: "underscore-1.13.6",
      },
      metadata: {
        "Name": "string",
        "Version": "1.2.3",
        "ID": "string",
      }
  });
  const res = httpMocks.createResponse();
  await app(req, res);
  // now you can make assertions about the response
  console.log(res._getData());
  expect(res.statusCode).toBe(200);
 });
});
