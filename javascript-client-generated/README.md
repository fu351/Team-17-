# ece_461___fall_2023___project_phase_2

Ece461Fall2023ProjectPhase2 - JavaScript client for ece_461___fall_2023___project_phase_2
API for ECE 461/Fall 2023/Project Phase 2: A Trustworthy Module Registry\"  All endpoints have BASELINE or NON-BASELINE listed. Please read through all descriptions before raising questions.   A package ID is unique identifier for Package and Version. (Key idea -> id is unique for all pacakges).  Eg.       PacakgeName: Alpha, PackageVersion: 1.1.1 -> PackageID: 988645763         PacakgeName: Alpha, PackageVersion: 1.3.2 -> PackageID: 357898765
This SDK is automatically generated by the [Swagger Codegen](https://github.com/swagger-api/swagger-codegen) project:

- API version: 2.4.1
- Package version: 2.4.1
- Build package: io.swagger.codegen.v3.generators.javascript.JavaScriptClientCodegen
For more information, please visit [http://davisjam.github.io](http://davisjam.github.io)

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

To publish the library as a [npm](https://www.npmjs.com/),
please follow the procedure in ["Publishing npm packages"](https://docs.npmjs.com/getting-started/publishing-npm-packages).

Then install it via:

```shell
npm install ece_461___fall_2023___project_phase_2 --save
```

#### git
#
If the library is hosted at a git repository, e.g.
https://github.com/GIT_USER_ID/GIT_REPO_ID
then install it via:

```shell
    npm install GIT_USER_ID/GIT_REPO_ID --save
```

### For browser

The library also works in the browser environment via npm and [browserify](http://browserify.org/). After following
the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming *main.js* is your entry file):

```shell
browserify main.js > bundle.js
```

Then include *bundle.js* in the HTML pages.

### Webpack Configuration

Using Webpack you may encounter the following error: "Module not found: Error:
Cannot resolve module", most certainly you should disable AMD loader. Add/merge
the following section to your webpack config:

```javascript
module: {
  rules: [
    {
      parser: {
        amd: false
      }
    }
  ]
}
```

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var Ece461Fall2023ProjectPhase2 = require('ece_461___fall_2023___project_phase_2');

var api = new Ece461Fall2023ProjectPhase2.DefaultApi()
var body = new Ece461Fall2023ProjectPhase2.AuthenticationRequest(); // {AuthenticationRequest} 

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.createAuthToken(body, callback);
```

## Documentation for API Endpoints

All URIs are relative to */*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**createAuthToken**](docs/DefaultApi.md#createAuthToken) | **PUT** /authenticate | (NON-BASELINE)
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**packageByNameDelete**](docs/DefaultApi.md#packageByNameDelete) | **DELETE** /package/byName/{name} | Delete all versions of this package. (NON-BASELINE)
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**packageByNameGet**](docs/DefaultApi.md#packageByNameGet) | **GET** /package/byName/{name} | (NON-BASELINE)
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**packageByRegExGet**](docs/DefaultApi.md#packageByRegExGet) | **POST** /package/byRegEx | Get any packages fitting the regular expression (BASELINE).
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**packageCreate**](docs/DefaultApi.md#packageCreate) | **POST** /package | Upload or Ingest a new package. (BASELINE)
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**packageDelete**](docs/DefaultApi.md#packageDelete) | **DELETE** /package/{id} | Delete this version of the package. (NON-BASELINE)
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**packageRate**](docs/DefaultApi.md#packageRate) | **GET** /package/{id}/rate | Get ratings for this package. (BASELINE)
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**packageRetrieve**](docs/DefaultApi.md#packageRetrieve) | **GET** /package/{id} | Interact with the package with this ID. (BASELINE)
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**packageUpdate**](docs/DefaultApi.md#packageUpdate) | **PUT** /package/{id} | Update this content of the package. (BASELINE)
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**packagesList**](docs/DefaultApi.md#packagesList) | **POST** /packages | Get the packages from the registry. (BASELINE)
*Ece461Fall2023ProjectPhase2.DefaultApi* | [**registryReset**](docs/DefaultApi.md#registryReset) | **DELETE** /reset | Reset the registry. (BASELINE)

## Documentation for Models

 - [Ece461Fall2023ProjectPhase2.AuthenticationRequest](docs/AuthenticationRequest.md)
 - [Ece461Fall2023ProjectPhase2.AuthenticationToken](docs/AuthenticationToken.md)
 - [Ece461Fall2023ProjectPhase2.EnumerateOffset](docs/EnumerateOffset.md)
 - [Ece461Fall2023ProjectPhase2.ModelPackage](docs/ModelPackage.md)
 - [Ece461Fall2023ProjectPhase2.PackageData](docs/PackageData.md)
 - [Ece461Fall2023ProjectPhase2.PackageHistoryEntry](docs/PackageHistoryEntry.md)
 - [Ece461Fall2023ProjectPhase2.PackageID](docs/PackageID.md)
 - [Ece461Fall2023ProjectPhase2.PackageMetadata](docs/PackageMetadata.md)
 - [Ece461Fall2023ProjectPhase2.PackageName](docs/PackageName.md)
 - [Ece461Fall2023ProjectPhase2.PackageQuery](docs/PackageQuery.md)
 - [Ece461Fall2023ProjectPhase2.PackageRating](docs/PackageRating.md)
 - [Ece461Fall2023ProjectPhase2.PackageRegEx](docs/PackageRegEx.md)
 - [Ece461Fall2023ProjectPhase2.SemverRange](docs/SemverRange.md)
 - [Ece461Fall2023ProjectPhase2.User](docs/User.md)
 - [Ece461Fall2023ProjectPhase2.UserAuthenticationInfo](docs/UserAuthenticationInfo.md)

## Documentation for Authorization

 All endpoints do not require authorization.
