"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _app = _interopRequireDefault(require("./app"));

var database = _interopRequireWildcard(require("./database/mockDatabase"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import * as database from './database/mysqlDatabase'
describe("app users", () => {
  var testApp;
  beforeEach(() => testApp = (0, _supertest.default)((0, _app.default)({
    database
  })));
  describe('The posts path', () => {
    test("It should reject when there's no cookie", /*#__PURE__*/_asyncToGenerator(function* () {
      var response = yield testApp.get('/api/posts');
      expect(response.forbidden).toBe(true);
      console.log(response);
    })); // test("It should not reject when there's a cookie", async () => {
    //   console.log(testApp)
    //   const response = await (testApp.get('/api/posts').set({
    //     'Cookie': 'connect.sid=s%3AC9MTMeCmlpRvzeL6eS3LPcCFvv7_zFg7.vo7hETsqscbLpHPHEtbqvr%2B4cpRtKHj8jucTW9Tkshk',
    //     'Accept': '*/*'
    //   }
    //   ))
    //   expect(response.forbidden).toBe(false)
    // })
    // test('It should call create post', async () => {
    //   expect(database.createUser.callCount).toBe(0)
    //   const user = {email: 'sam@sam.sam', username: 'sam', password: 'sam', fullName: 'sam sam'}
    //   const response = await testApp.post('/api/users').send({user})
    //   expect(database.createUser.callCount).toBe(1)
    //   expect(database.createUser.params[0]).toEqual(user)
    // })
  });
});