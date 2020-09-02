"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _express = _interopRequireDefault(require("express"));

var ec2Meta = _interopRequireWildcard(require("../ec2Meta"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(_ref) {
  var {
    database
  } = _ref;

  var router = _express.default.Router();

  router.get('/', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (req, res) {
      var mysql;

      try {
        var connection = yield database.status();
        mysql = {
          state: connection.state,
          host: connection.host,
          datbase: connection.database
        };
      } catch (err) {
        mysql = err;
      }

      var ec2 = {};

      try {
        ec2.ipv4 = yield ec2Meta.ipv4();
        ec2.hostname = yield ec2Meta.hostname();
        ec2.instanceId = yield ec2Meta.instanceId();
      } catch (err) {
        console.log(err);
        ec2 = "error";
      }

      var other = {};
      var data = {
        mysql,
        ec2,
        other
      };
      console.log(data);
      res.send(data);
    });

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  return router;
}