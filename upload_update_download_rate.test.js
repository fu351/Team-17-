//npm install jest supertest --save-dev
// run by npx jest upload_update_download_rate.test.js
const request = require('supertest');
const app = require('./upload_update_download_rate'); // Import your app or server
const httpMocks = require('node-mocks-http');
const fs = require('fs');

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
    await app(req, res);
    expect(res.statusCode).toBe(201);
  });
/*
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

  }); // Add a closing curly brace here*/
});



/*
describe('GET /package/{id}/rate', () => {
  it('rate a file with an invalid id', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/package/{id}/rate',
      params: {
        id: 1,
      },
  });
  const res = httpMocks.createResponse();
  await app(req, res);
  // now you can make assertions about the response
  expect(res.statusCode).toBe(400);
  });
});
*/