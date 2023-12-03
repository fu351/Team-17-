# Ece461Fall2023ProjectPhase2.DefaultApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAuthToken**](DefaultApi.md#createAuthToken) | **PUT** /authenticate | (NON-BASELINE)
[**packageByNameDelete**](DefaultApi.md#packageByNameDelete) | **DELETE** /package/byName/{name} | Delete all versions of this package. (NON-BASELINE)
[**packageByNameGet**](DefaultApi.md#packageByNameGet) | **GET** /package/byName/{name} | (NON-BASELINE)
[**packageByRegExGet**](DefaultApi.md#packageByRegExGet) | **POST** /package/byRegEx | Get any packages fitting the regular expression (BASELINE).
[**packageCreate**](DefaultApi.md#packageCreate) | **POST** /package | Upload or Ingest a new package. (BASELINE)
[**packageDelete**](DefaultApi.md#packageDelete) | **DELETE** /package/{id} | Delete this version of the package. (NON-BASELINE)
[**packageRate**](DefaultApi.md#packageRate) | **GET** /package/{id}/rate | Get ratings for this package. (BASELINE)
[**packageRetrieve**](DefaultApi.md#packageRetrieve) | **GET** /package/{id} | Interact with the package with this ID. (BASELINE)
[**packageUpdate**](DefaultApi.md#packageUpdate) | **PUT** /package/{id} | Update this content of the package. (BASELINE)
[**packagesList**](DefaultApi.md#packagesList) | **POST** /packages | Get the packages from the registry. (BASELINE)
[**registryReset**](DefaultApi.md#registryReset) | **DELETE** /reset | Reset the registry. (BASELINE)

<a name="createAuthToken"></a>
# **createAuthToken**
> AuthenticationToken createAuthToken(body)

(NON-BASELINE)

Create an access token.

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let body = new Ece461Fall2023ProjectPhase2.AuthenticationRequest(); // AuthenticationRequest | 

apiInstance.createAuthToken(body, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**AuthenticationRequest**](AuthenticationRequest.md)|  | 

### Return type

[**AuthenticationToken**](AuthenticationToken.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="packageByNameDelete"></a>
# **packageByNameDelete**
> packageByNameDelete(xAuthorization, name)

Delete all versions of this package. (NON-BASELINE)

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 
let name = new Ece461Fall2023ProjectPhase2.PackageName(); // PackageName | 

apiInstance.packageByNameDelete(xAuthorization, name, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 
 **name** | [**PackageName**](.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="packageByNameGet"></a>
# **packageByNameGet**
> [PackageHistoryEntry] packageByNameGet(name, xAuthorization)

(NON-BASELINE)

Return the history of this package (all versions).

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let name = new Ece461Fall2023ProjectPhase2.PackageName(); // PackageName | 
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 

apiInstance.packageByNameGet(name, xAuthorization, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | [**PackageName**](.md)|  | 
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 

### Return type

[**[PackageHistoryEntry]**](PackageHistoryEntry.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="packageByRegExGet"></a>
# **packageByRegExGet**
> [PackageMetadata] packageByRegExGet(body, xAuthorization)

Get any packages fitting the regular expression (BASELINE).

Search for a package using regular expression over package names and READMEs. This is similar to search by name.

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let body = new Ece461Fall2023ProjectPhase2.PackageRegEx(); // PackageRegEx | 
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 

apiInstance.packageByRegExGet(body, xAuthorization, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PackageRegEx**](PackageRegEx.md)|  | 
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 

### Return type

[**[PackageMetadata]**](PackageMetadata.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="packageCreate"></a>
# **packageCreate**
> ModelPackage packageCreate(body, xAuthorization)

Upload or Ingest a new package. (BASELINE)

Upload or Ingest a new package. Packages that are uploaded may have the same name but a new version. Refer to the description above to see how an id is formed for a pacakge. 

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let body = new Ece461Fall2023ProjectPhase2.PackageData(); // PackageData | 
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 

apiInstance.packageCreate(body, xAuthorization, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**PackageData**](PackageData.md)|  | 
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 

### Return type

[**ModelPackage**](ModelPackage.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="packageDelete"></a>
# **packageDelete**
> packageDelete(xAuthorization, id)

Delete this version of the package. (NON-BASELINE)

Delete only the package that matches \&quot;id\&quot;. (id is a unique identifier for a packge)

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 
let id = new Ece461Fall2023ProjectPhase2.PackageID(); // PackageID | Package ID

apiInstance.packageDelete(xAuthorization, id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 
 **id** | [**PackageID**](.md)| Package ID | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="packageRate"></a>
# **packageRate**
> PackageRating packageRate(id, xAuthorization)

Get ratings for this package. (BASELINE)

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let id = new Ece461Fall2023ProjectPhase2.PackageID(); // PackageID | 
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 

apiInstance.packageRate(id, xAuthorization, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**PackageID**](.md)|  | 
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 

### Return type

[**PackageRating**](PackageRating.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="packageRetrieve"></a>
# **packageRetrieve**
> ModelPackage packageRetrieve(xAuthorization, id)

Interact with the package with this ID. (BASELINE)

Return this package.

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 
let id = new Ece461Fall2023ProjectPhase2.PackageID(); // PackageID | ID of package to fetch

apiInstance.packageRetrieve(xAuthorization, id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 
 **id** | [**PackageID**](.md)| ID of package to fetch | 

### Return type

[**ModelPackage**](ModelPackage.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="packageUpdate"></a>
# **packageUpdate**
> packageUpdate(body, xAuthorization, id)

Update this content of the package. (BASELINE)

The name, version, and ID must match.  The package contents (from PackageData) will replace the previous contents.

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let body = new Ece461Fall2023ProjectPhase2.ModelPackage(); // ModelPackage | 
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 
let id = new Ece461Fall2023ProjectPhase2.PackageID(); // PackageID | 

apiInstance.packageUpdate(body, xAuthorization, id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ModelPackage**](ModelPackage.md)|  | 
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 
 **id** | [**PackageID**](.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="packagesList"></a>
# **packagesList**
> [PackageMetadata] packagesList(body, xAuthorization, opts)

Get the packages from the registry. (BASELINE)

Get any packages fitting the query. Search for packages satisfying the indicated query.  If you want to enumerate all packages, provide an array with a single PackageQuery whose name is \&quot;*\&quot;.  The response is paginated; the response header includes the offset to use in the next query.  In the Request Body below, \&quot;Version\&quot; has all the possible inputs. The \&quot;Version\&quot; cannot be a combinaiton fo the all the possibilities. 

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let body = [new Ece461Fall2023ProjectPhase2.PackageQuery()]; // [PackageQuery] | 
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 
let opts = { 
  'offset': new Ece461Fall2023ProjectPhase2.EnumerateOffset() // EnumerateOffset | Provide this for pagination. If not provided, returns the first page of results.
};
apiInstance.packagesList(body, xAuthorization, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**[PackageQuery]**](PackageQuery.md)|  | 
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 
 **offset** | [**EnumerateOffset**](.md)| Provide this for pagination. If not provided, returns the first page of results. | [optional] 

### Return type

[**[PackageMetadata]**](PackageMetadata.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="registryReset"></a>
# **registryReset**
> registryReset(xAuthorization)

Reset the registry. (BASELINE)

Reset the registry to a system default state.

### Example
```javascript
import {Ece461Fall2023ProjectPhase2} from 'ece_461___fall_2023___project_phase_2';

let apiInstance = new Ece461Fall2023ProjectPhase2.DefaultApi();
let xAuthorization = new Ece461Fall2023ProjectPhase2.AuthenticationToken(); // AuthenticationToken | 

apiInstance.registryReset(xAuthorization, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xAuthorization** | [**AuthenticationToken**](.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

