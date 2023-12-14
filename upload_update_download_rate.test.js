//npm install jest supertest --save-dev
// run by npx jest upload_update_download_rate.test.js
const request = require('supertest');
const app = require('./upload_update_download_rate'); // Import your app or server
const httpMocks = require('node-mocks-http');
const fs = require('fs');

describe('POST /package', () => {
  // test cases1 upload a file
  
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
  

}); 


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

/* 
describe('PUT /package/{id}', () => {
  //test the update function
  it('should update a file with an working id', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: `/package/underscore-1.13.6`,
      params: {
        id: "underscore-1.13.6",
      },
      metadata: {
        "Name": "underscore",
        "Version": "1.13.6",
        "ID": "underscore-1.13.6",
      },
      data: {
        "URL": "https://github.com/jashkenas/underscore",
      }
  });
  const res = httpMocks.createResponse();
  await app(req, res);
  // now you can make assertions about the response
  console.log(res._getData());
  expect(res.statusCode).toBe(200);
 });
}); */

