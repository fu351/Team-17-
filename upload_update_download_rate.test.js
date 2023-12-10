//npm install jest supertest --save-dev
// run by npx jest upload_update_download_rate.test.js
const request = require('supertest');
const app = require('./upload_update_download_rate'); // Import your app or server
const httpMocks = require('node-mocks-http');

describe('POST /package', () => {
  /*
    it('should upload a file', async () => {
    const res = await request(app).post('/package').attach('file', 'catpics.zip').set('Accept', 'application/json');
    expect(res.statusCode).toEqual(200);
    // Add more assertions based on your application's response
  });
*/
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
});
