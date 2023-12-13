const request = require('supertest');
const app = require('./search'); // Import your app or server
const httpMocks = require('node-mocks-http');
const fs = require('fs');

/* describe('Get /package/{id}', () => {
    it('search a file with an working id', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: `/package/underscore-1.13.6`,
        params: {
          id: "underscore-1.13.6",
        },
    });
    const res = httpMocks.createResponse();
    await app(req, res);
    // now you can make assertions about the response
    expect(res.statusCode).toBe(200);
    });
  }); */
 /* describe('Get /package/byName/{name}', () => {
    it('search a file by Name', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: `/package/byName/underscore`,
        params: {
          name: "underscore",
        },
    });
    const res = httpMocks.createResponse();
    await app(req, res);
    // now you can make assertions about the response
    expect(res.statusCode).toBe(200);
    });
  }); */
  
   describe('Get /package/RegEx', () => {
    it('search a file with RegEx', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `/package/byRegEx`,
        body: {
          regEx: "underscore",
        },
    });
    const res = httpMocks.createResponse();
    await app(req, res);
    // now you can make assertions about the response
    expect(res.statusCode).toBe(200);
    });
  });
  