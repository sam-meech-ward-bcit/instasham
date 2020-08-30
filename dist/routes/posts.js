"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(_ref) {
  var {
    database,
    authorize,
    upload
  } = _ref;

  var router = _express.default.Router(); // get all posts


  router.get('/', authorize, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (req, res, next) {
      var posts = yield database.getPosts({
        userId: req.user.id,
        limit: 100
      });
      res.send({
        posts
      });
    });

    return function (_x, _x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }()); // Create a new post

  router.post('/', authorize, upload, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* (req, res, next) {
      var media = req.files.map(file => ({
        url: "/images/posts/".concat(file.filename),
        type: 'image'
      }));
      var post = yield database.createPost({
        userId: req.user.id,
        description: req.body.description,
        media
      });
      res.send({
        post
      });
    });

    return function (_x4, _x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }()); // Get a post's comments

  router.get('/:id/comments', authorize, /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(function* (req, res, next) {
      res.send({});
    });

    return function (_x7, _x8, _x9) {
      return _ref4.apply(this, arguments);
    };
  }()); // Create a new comment

  router.post('/:id/comments', authorize, /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(function* (req, res, next) {
      var userId = req.user.id;
      var postId = req.params.id;
      var {
        message
      } = req.body;
      var comment = yield database.addComment({
        userId,
        postId,
        message
      });
      res.send({
        comment
      });
    });

    return function (_x10, _x11, _x12) {
      return _ref5.apply(this, arguments);
    };
  }()); // Create a new like

  router.post('/:id/likes', authorize, /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(function* (req, res, next) {
      var userId = req.user.id;
      var postId = req.params.id;
      var post = yield database.likePost({
        likerId: userId,
        userId,
        postId
      });
      res.send({
        post
      });
    });

    return function (_x13, _x14, _x15) {
      return _ref6.apply(this, arguments);
    };
  }());
  return router;
}