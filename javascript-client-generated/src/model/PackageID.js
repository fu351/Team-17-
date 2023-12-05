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
import {ApiClient} from '../ApiClient';

/**
 * The PackageID model module.
 * @module model/PackageID
 * @version 2.4.1
 */
export class PackageID {
  /**
   * Constructs a new <code>PackageID</code>.
   * @alias module:model/PackageID
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>PackageID</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PackageID} obj Optional instance to populate.
   * @return {module:model/PackageID} The populated <code>PackageID</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new PackageID();
    }
    return obj;
  }
}