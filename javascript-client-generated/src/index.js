/*
 * ECE 461 - Fall 2023 - Project Phase 2
 * API for ECE 461/Fall 2023/Project Phase 2: A Trustworthy Module Registry\"  All endpoints have BASELINE or NON-BASELINE listed. Please read through all descriptions before raising questions.   A package ID is unique identifier for Package and Version. (Key idea -> id is unique for all pacakges).  Eg.       PacakgeName: Alpha, PackageVersion: 1.1.1 -> PackageID: 988645763         PacakgeName: Alpha, PackageVersion: 1.3.2 -> PackageID: 357898765
 *
 * OpenAPI spec version: 2.4.1
 * Contact: davisjam@purdue.edu
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.50
 *
 * Do not edit the class manually.
 *
 */
import {ApiClient} from './ApiClient';
import {AuthenticationRequest} from './model/AuthenticationRequest';
import {AuthenticationToken} from './model/AuthenticationToken';
import {EnumerateOffset} from './model/EnumerateOffset';
import {ModelPackage} from './model/ModelPackage';
import {PackageData} from './model/PackageData';
import {PackageHistoryEntry} from './model/PackageHistoryEntry';
import {PackageID} from './model/PackageID';
import {PackageMetadata} from './model/PackageMetadata';
import {PackageName} from './model/PackageName';
import {PackageQuery} from './model/PackageQuery';
import {PackageRating} from './model/PackageRating';
import {PackageRegEx} from './model/PackageRegEx';
import {SemverRange} from './model/SemverRange';
import {User} from './model/User';
import {UserAuthenticationInfo} from './model/UserAuthenticationInfo';
import {DefaultApi} from './api/DefaultApi';

/**
* API_for_ECE_461Fall_2023Project_Phase_2_A_Trustworthy_Module_RegistryAll_endpoints_have_BASELINE_or_NON_BASELINE_listed__Please_read_through_all_descriptions_before_raising_questions__A_package_ID_is_unique_identifier_for_Package_and_Version___Key_idea___id_is_unique_for_all_pacakges_Eg______PacakgeName_Alpha_PackageVersion_1_1_1___PackageID_988645763_______PacakgeName_Alpha_PackageVersion_1_3_2___PackageID_357898765.<br>
* The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
* <p>
* An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
* <pre>
* var Ece461Fall2023ProjectPhase2 = require('index'); // See note below*.
* var xxxSvc = new Ece461Fall2023ProjectPhase2.XxxApi(); // Allocate the API class we're going to use.
* var yyyModel = new Ece461Fall2023ProjectPhase2.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
* and put the application logic within the callback function.</em>
* </p>
* <p>
* A non-AMD browser application (discouraged) might do something like this:
* <pre>
* var xxxSvc = new Ece461Fall2023ProjectPhase2.XxxApi(); // Allocate the API class we're going to use.
* var yyy = new Ece461Fall2023ProjectPhase2.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* </p>
* @module index
* @version 2.4.1
*/
export {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient,

    /**
     * The AuthenticationRequest model constructor.
     * @property {module:model/AuthenticationRequest}
     */
    AuthenticationRequest,

    /**
     * The AuthenticationToken model constructor.
     * @property {module:model/AuthenticationToken}
     */
    AuthenticationToken,

    /**
     * The EnumerateOffset model constructor.
     * @property {module:model/EnumerateOffset}
     */
    EnumerateOffset,

    /**
     * The ModelPackage model constructor.
     * @property {module:model/ModelPackage}
     */
    ModelPackage,

    /**
     * The PackageData model constructor.
     * @property {module:model/PackageData}
     */
    PackageData,

    /**
     * The PackageHistoryEntry model constructor.
     * @property {module:model/PackageHistoryEntry}
     */
    PackageHistoryEntry,

    /**
     * The PackageID model constructor.
     * @property {module:model/PackageID}
     */
    PackageID,

    /**
     * The PackageMetadata model constructor.
     * @property {module:model/PackageMetadata}
     */
    PackageMetadata,

    /**
     * The PackageName model constructor.
     * @property {module:model/PackageName}
     */
    PackageName,

    /**
     * The PackageQuery model constructor.
     * @property {module:model/PackageQuery}
     */
    PackageQuery,

    /**
     * The PackageRating model constructor.
     * @property {module:model/PackageRating}
     */
    PackageRating,

    /**
     * The PackageRegEx model constructor.
     * @property {module:model/PackageRegEx}
     */
    PackageRegEx,

    /**
     * The SemverRange model constructor.
     * @property {module:model/SemverRange}
     */
    SemverRange,

    /**
     * The User model constructor.
     * @property {module:model/User}
     */
    User,

    /**
     * The UserAuthenticationInfo model constructor.
     * @property {module:model/UserAuthenticationInfo}
     */
    UserAuthenticationInfo,

    /**
    * The DefaultApi service constructor.
    * @property {module:api/DefaultApi}
    */
    DefaultApi
};