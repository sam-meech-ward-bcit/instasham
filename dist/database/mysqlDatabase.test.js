"use strict";

var database = _interopRequireWildcard(require("./mysqlDatabase"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// process.env.MYSQL_HOST = 'localhost',
// process.env.MYSQL_USERNAME = 'root',
// process.env.MYSQL_PASSWORD = '',
// process.env.MYSQL_DATABASE = 'instasam_tests'
var wait = time => new Promise(res => setTimeout(res, time));

function wipeDatabase() {
  return _wipeDatabase.apply(this, arguments);
}

function _wipeDatabase() {
  _wipeDatabase = _asyncToGenerator(function* () {
    yield database.run("DELETE FROM comment_hashtags");
    yield database.run("DELETE FROM post_hashtags");
    yield database.run("DELETE FROM hashtags");
    yield database.run("DELETE FROM comment_mention");
    yield database.run("DELETE FROM post_mention");
    yield database.run("DELETE FROM comment_likes");
    yield database.run("DELETE FROM post_likes");
    yield database.run("DELETE FROM comments");
    yield database.run("DELETE FROM media_items");
    yield database.run("DELETE FROM posts");
    yield database.run("DELETE FROM filters");
    yield database.run("DELETE FROM followers");
    yield database.run("DELETE FROM login_activity");
    yield database.run("DELETE FROM users");
  });
  return _wipeDatabase.apply(this, arguments);
}

describe("database", () => {
  beforeAll( /*#__PURE__*/_asyncToGenerator(function* () {
    yield wipeDatabase();
  }));
  afterAll( /*#__PURE__*/_asyncToGenerator(function* () {
    // await wipeDatabase()
    yield database.end();
  }));
  describe('users', () => {
    beforeEach( /*#__PURE__*/_asyncToGenerator(function* () {
      yield wipeDatabase();
    }));
    test('should return undefined when no user exists', /*#__PURE__*/_asyncToGenerator(function* () {
      var error;

      try {
        yield database.getUserWithEmail('test@test.test');
      } catch (e) {
        error = e;
      }

      expect(error).not.toBe(undefined);
    }));
    test('should create a new user', /*#__PURE__*/_asyncToGenerator(function* () {
      var userDetails = {
        username: 'sam',
        password: 'sam',
        email: 'sam@sam.sam',
        fullName: 'sam sam'
      };
      var user = yield database.createUser(userDetails);
      var userQueried = yield database.getUser(userDetails);
      expect(user).toEqual(userQueried);
    }));
    test('should give error when incorrect password is used', /*#__PURE__*/_asyncToGenerator(function* () {
      var userDetails = {
        username: 'sam',
        password: 'sam',
        email: 'sam@sam.sam',
        fullName: 'sam sam'
      };
      yield database.createUser(userDetails);
      var error;

      try {
        yield database.getUser(_objectSpread(_objectSpread({}, userDetails), {}, {
          password: 'bad'
        }));
      } catch (e) {
        error = e;
      }

      expect(error).not.toBe(undefined);
    }));
  });
  describe('posts', () => {
    var user;
    var userDetails = {
      username: 'postUser',
      password: 'sam',
      email: 'postUser@sam.sam',
      fullName: 'post user'
    };
    beforeAll( /*#__PURE__*/_asyncToGenerator(function* () {
      user = yield database.createUser(userDetails);
    }));
    test("Post with single image", /*#__PURE__*/_asyncToGenerator(function* () {
      var media = [{
        type: 'image',
        url: "some_url"
      }];
      var post = yield database.createPost({
        userId: user.id,
        description: "This is a post",
        media
      });
      expect(post.media.length).toBe(media.length);
    }));
    test("Post with multi image", /*#__PURE__*/_asyncToGenerator(function* () {
      var media = [{
        type: 'image',
        url: "some_url1"
      }, {
        type: 'image',
        url: "some_url2"
      }, {
        type: 'image',
        url: "some_url3"
      }];
      var post = yield database.createPost({
        userId: user.id,
        description: "This is a post 2",
        media
      });
      console.log(post.media, post.media.length, media.length);
      expect(post.media.length).toBe(media.length);
    }));
    test("Like a post", /*#__PURE__*/_asyncToGenerator(function* () {
      var userDetails = {
        username: 'liker',
        password: 'sam',
        email: 'liker@sam.sam',
        fullName: 'sam sam'
      };
      var likerUser = yield database.createUser(userDetails);
      var media = [{
        type: 'image',
        url: "some_url"
      }];
      var post = yield database.createPost({
        userId: user.id,
        description: "This is a post",
        media
      });
      expect(post.total_likes).toBe(0);
      post = yield database.likePost({
        userId: likerUser.id,
        postId: post.id
      });
      expect(post.total_likes).toBe(1);
    }));
    test("Comment a post", /*#__PURE__*/_asyncToGenerator(function* () {
      var media = [{
        type: 'image',
        url: "some_url"
      }];
      var post = yield database.createPost({
        userId: user.id,
        description: "This is a post",
        media
      });
      expect(post.messages.length).toBe(0);
      var comment = yield database.addComment({
        userId: user.id,
        postId: post.id,
        message: "This is a comment"
      });
      post = yield database.getPost({
        postId: post.id
      });
      expect(post.messages.length).toBe(1);
      yield database.addComment({
        userId: user.id,
        postId: post.id,
        message: "This is another comment"
      });
      post = yield database.getPost({
        postId: post.id
      });
      expect(post.messages.length).toBe(2);
      var comment3 = yield database.addComment({
        userId: user.id,
        postId: post.id,
        message: "This is another comment again"
      });
      post = yield database.getPost({
        postId: post.id
      });
      expect(post.messages.length).toBe(2);
      expect(post.messages[0].id).toBe(comment3.id);
      console.log(post, comment3);
    }));
  });
});