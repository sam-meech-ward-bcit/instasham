"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeSession = storeSession;
exports.createUser = exports.getUserWithEmail = exports.getUser = exports.addComment = exports.likePost = exports.createPost = exports.getPost = exports.getPosts = exports.users = exports.posts = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var posts = [{}];
exports.posts = posts;
var users = [{}];
exports.users = users;

function mockFunction(fn) {
  function newfn() {
    newfn.callCount++;

    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    newfn.params = params;
    return fn(...params);
  }

  newfn.callCount = 0;
  return newfn;
}

function storeSession() {}

var getPosts = mockFunction( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (_ref) {
    var {
      userId,
      limit
    } = _ref;
    return posts;
  });

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());
exports.getPosts = getPosts;
var getPost = mockFunction( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (_ref3) {
    var {
      postId
    } = _ref3;
    return posts[0];
  });

  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}());
exports.getPost = getPost;
var createPost = mockFunction( /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(function* (_ref5) {
    var {
      userId,
      description,
      media
    } = _ref5;
    var post = {
      user_id: userId,
      description,
      media,
      id: posts.length + 1,
      total_likes: 0,
      comments: []
    };
    posts.push(post);
    return post;
  });

  return function (_x3) {
    return _ref6.apply(this, arguments);
  };
}());
exports.createPost = createPost;
var likePost = mockFunction( /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(function* (_ref7) {
    var {
      userId,
      postId
    } = _ref7;
    var post = posts.find(post => post.id == postId);
    post.total_likes++;
    return post;
  });

  return function (_x4) {
    return _ref8.apply(this, arguments);
  };
}());
exports.likePost = likePost;
var addComment = mockFunction( /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(function* (_ref9) {
    var {
      userId,
      postId,
      message
    } = _ref9;
    var post = posts.find(post => post.id == postId);
    post.comments.push({
      user_id: userId,
      message
    });
    return post;
  });

  return function (_x5) {
    return _ref10.apply(this, arguments);
  };
}());
exports.addComment = addComment;
var getUser = mockFunction( /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(function* (options) {
    return users.find(user => user.email === options.email);
  });

  return function (_x6) {
    return _ref11.apply(this, arguments);
  };
}());
exports.getUser = getUser;
var getUserWithEmail = mockFunction( /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(function* (email) {
    return getUser({
      email
    });
  });

  return function (_x7) {
    return _ref12.apply(this, arguments);
  };
}());
exports.getUserWithEmail = getUserWithEmail;
var createUser = mockFunction( /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(function* (_ref13) {
    var {
      email,
      username,
      password,
      fullName
    } = _ref13;
    var user = {
      id: users.length + 1,
      email,
      username,
      password,
      full_name: fullName
    };
    console.log('create user', user);
    users.push(user);
    return user;
  });

  return function (_x8) {
    return _ref14.apply(this, arguments);
  };
}());
exports.createUser = createUser;