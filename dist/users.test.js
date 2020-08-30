"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _app = _interopRequireDefault(require("./app"));

var database = _interopRequireWildcard(require("./database/mockDatabase"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import * as database from './database/mysqlDatabase'
describe("app users", () => {
  var testApp;
  beforeAll(() => testApp = (0, _supertest.default)((0, _app.default)({
    database
  })));
  describe('The users path', () => {
    test('It should create a new user', /*#__PURE__*/_asyncToGenerator(function* () {
      expect(database.createUser.callCount).toBe(0);
      var user = {
        email: 'sam@sam.sam',
        username: 'sam',
        password: 'sam',
        fullName: 'sam sam'
      };
      var response = yield testApp.post('/api/users').send({
        user
      });
      expect(database.createUser.callCount).toBe(1);
      expect(database.createUser.params[0]).toEqual(user);
    }));
    test('It should respond with a session', /*#__PURE__*/_asyncToGenerator(function* () {
      var user = {
        email: 'sam@sam.sam',
        username: 'sam',
        password: 'sam',
        fullName: 'sam sam'
      };
      var response = yield testApp.post('/api/users').send({
        user
      });
      expect(response.header['set-cookie']).not.toBe(null);
      console.log(response.header['set-cookie']);
    }));
  });
  describe('login', () => {
    test('It should check the database for the current user', /*#__PURE__*/_asyncToGenerator(function* () {
      expect(database.getUser.callCount).toBe(0);
      var user = {
        email: 'sam@sam.sam',
        password: 'sam'
      };
      yield testApp.post('/api/users/login').send({
        user
      });
      expect(database.getUser.callCount).toBe(1);
      expect(database.getUser.params[0]).toEqual(user);
    }));
    test('It should respond with a session', /*#__PURE__*/_asyncToGenerator(function* () {
      var user = {
        email: 'sam@sam.sam',
        password: 'sam'
      };
      database.users.push(_objectSpread({
        id: 100
      }, user));
      var response = yield testApp.post('/api/users/login').send({
        user
      });
      expect(response.header['set-cookie']).not.toBe(null);
      console.log(response.header['set-cookie']);
    }));
  });
});