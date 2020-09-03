"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(_ref) {
  var {
    database,
    authorize,
    upload,
    generateAccessToken
  } = _ref;

  var router = _express.default.Router();

  function sendUser(_ref2) {
    var {
      res,
      user
    } = _ref2;
    var accessToken = generateAccessToken({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        username: user.username
      }
    });
    res.cookie('token', accessToken);
    res.send({
      accessToken: accessToken
    });
  } // Create a new user


  router.post('/', upload, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* (req, res, next) {
      var image = req.file;
      var user = req.body.user;

      if (typeof user === 'string') {
        user = JSON.parse(user);
      }

      var imageUrl = "/images/avatars/".concat(image.filename);
      console.log('avatar', image, 'user', user, 'imageUrl', imageUrl);

      try {
        var dbuser = yield database.createUser(_objectSpread(_objectSpread({}, user), {}, {
          profilePhoto: imageUrl
        }));
        console.log("Created user", dbuser);
        sendUser({
          res,
          user: dbuser
        });
      } catch (error) {
        console.log(error);
        res.send({
          error
        });
      }
    });

    return function (_x, _x2, _x3) {
      return _ref3.apply(this, arguments);
    };
  }());
  router.post('/login', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(function* (req, res, next) {
      try {
        var user = yield database.getUser(req.body.user);
        sendUser({
          res,
          user
        });
      } catch (error) {
        console.log(error);
        res.sendStatus(403);
      }
    });

    return function (_x4, _x5, _x6) {
      return _ref4.apply(this, arguments);
    };
  }());
  router.get('/me', authorize, /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(function* (req, res, next) {
      var user = yield database.getUser({
        id: req.user.id
      });
      sendUser({
        res,
        user
      });
    });

    return function (_x7, _x8, _x9) {
      return _ref5.apply(this, arguments);
    };
  }());
  router.post('/logout', function (req, res, next) {
    // res.cookie('token', null)
    res.cookie('token', {
      expires: Date.now()
    });
    res.send({
      user: null
    });
  }); // Get a user's posts

  router.get('/:id/posts', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(function* (req, res, next) {
      res.send({});
    });

    return function (_x10, _x11, _x12) {
      return _ref6.apply(this, arguments);
    };
  }());
  return router;
}