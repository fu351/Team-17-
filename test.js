//import the api from the javascript-client-generated code
import { DefaultApi, AuthenticationRequest } from './javascript-client-generated/src/index.js';
//import all the functions from the search.js file
import * as search from './search.js';
//create instance of the api

var api = new DefaultApi();
var body = new AuthenticationRequest();

var callback = function(error, data, response) {
    if (error) {
        console.error(error);
    } else {
        console.log('API called successfully. Returned data: ' + data);
    }
};
api.createAuthToken(body, callback);
search.searchByPackageID(api, 'packageID');
