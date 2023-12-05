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
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.Ece461Fall2023ProjectPhase2);
  }
}(this, function(expect, Ece461Fall2023ProjectPhase2) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('PackageQuery', function() {
      beforeEach(function() {
        instance = new Ece461Fall2023ProjectPhase2.PackageQuery();
      });

      it('should create an instance of PackageQuery', function() {
        // TODO: update the code to test PackageQuery
        expect(instance).to.be.a(Ece461Fall2023ProjectPhase2.PackageQuery);
      });

      it('should have the property version (base name: "Version")', function() {
        // TODO: update the code to test the property version
        expect(instance).to.have.property('version');
        // expect(instance.version).to.be(expectedValueLiteral);
      });

      it('should have the property name (base name: "Name")', function() {
        // TODO: update the code to test the property name
        expect(instance).to.have.property('name');
        // expect(instance.name).to.be(expectedValueLiteral);
      });

    });
  });

}));