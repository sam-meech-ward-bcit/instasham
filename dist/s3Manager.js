"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = s3Manager;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function s3Manager(_ref) {
  var {
    bucketName,
    region
  } = _ref;

  // Set the region 
  _awsSdk.default.config.update({
    region
  }); // Create S3 service object


  var s3 = new _awsSdk.default.S3({
    apiVersion: '2006-03-01'
  });

  function listBuckets() {
    return s3.listBuckets().promise();
  }

  function getBucketAcl() {
    return _getBucketAcl.apply(this, arguments);
  }

  function _getBucketAcl() {
    _getBucketAcl = _asyncToGenerator(function* () {
      var params = {
        Bucket: bucketName
      };
      return s3.getBucketAcl(params).promise();
    });
    return _getBucketAcl.apply(this, arguments);
  }

  function listObjects() {
    return _listObjects.apply(this, arguments);
  }

  function _listObjects() {
    _listObjects = _asyncToGenerator(function* () {
      var params = {
        Bucket: bucketName
      };
      return s3.listObjectsV2(params).promise();
    });
    return _listObjects.apply(this, arguments);
  }

  function upload(_ref2) {
    var {
      file
    } = _ref2;
    return new Promise((resolve, reject) => {
      // call S3 to retrieve upload file to specified bucket
      var uploadParams = {
        Bucket: bucketName,
        Key: '',
        Body: ''
      }; // Configure the file stream and obtain the upload parameters

      var fs = require('fs');

      var fileStream = fs.createReadStream(file);
      fileStream.on('error', function (err) {
        console.log('File Error', err);
      });
      uploadParams.Body = fileStream;

      var path = require('path');

      uploadParams.Key = path.basename(file); // call S3 to retrieve upload file to specified bucket

      s3.upload(uploadParams, function (err, data) {
        if (err) {
          reject(err);
        }

        if (data) {
          resolve(data);
        }
      });
    });
  }

  function getStream(_ref3) {
    var {
      fileKey
    } = _ref3;
    console.log('Trying to download file', fileKey);
    var options = {
      Bucket: bucketName,
      Key: fileKey
    };
    var fileStream = s3.getObject(options).createReadStream();
    return fileStream;
  }

  return {
    getStream,
    upload,
    listBuckets,
    listObjects,
    getBucketAcl
  };
}