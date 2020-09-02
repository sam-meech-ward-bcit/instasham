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

  var router = _express.default.Router();

  function sendUser(_ref2) {
    var {
      res,
      user
    } = _ref2;
    res.send({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        username: user.username
      }
    });
  } // Create a new user


  router.post('/', upload, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* (req, res, next) {
      var image = req.file; // const user = req.body.user
      // console.log(image, user)
      // res.send({user})

      var user = yield database.createUser(req.body.user);
      console.log("Created user", user);
      req.session.user = {
        id: user.id
      };
      sendUser({
        res,
        user
      });
    });

    return function (_x, _x2, _x3) {
      return _ref3.apply(this, arguments);
    };
  }());
  router.post('/login', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(function* (req, res, next) {
      try {
        var user = yield database.getUser(req.body.user);
        req.session.user = {
          id: user.id
        };
        sendUser({
          res,
          user
        });
      } catch (error) {
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
        id: req.session.user.id
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
    req.session.destroy();
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