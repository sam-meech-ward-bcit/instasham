"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _s3Manager = _interopRequireDefault(require("./s3Manager"));

var _users = _interopRequireDefault(require("./routes/users"));

var _posts = _interopRequireDefault(require("./routes/posts"));

var _status = _interopRequireDefault(require("./routes/status"));

var mysqlDatabase = _interopRequireWildcard(require("./database/mysqlDatabase"));

var _imageUploader = _interopRequireDefault(require("./imageUploader"));

var jwt = _interopRequireWildcard(require("./jwt"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var bucketName = process.env.BUCKET_NAME || "";
var region = process.env.BUCKET_REGION || "";
var s3 = (0, _s3Manager.default)({
  bucketName,
  region
});

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (params) {
    var app = (0, _express.default)();
    var database = (params === null || params === void 0 ? void 0 : params.database) || mysqlDatabase;
    app.use((0, _cookieParser.default)());
    app.use(_express.default.static(_path.default.join(__dirname, '../build')));
    app.use((0, _morgan.default)(':method :url :status :res[content-length] - :response-time ms'));
    app.use(_express.default.json());
    app.use(_express.default.urlencoded({
      extended: false
    }));
    app.use(_express.default.static(_path.default.join(__dirname, '../public')));
    app.use('/api/users', (0, _users.default)({
      s3,
      database,
      authorize: jwt.authenticateJWT,
      upload: _imageUploader.default.uploadAvatar,
      generateAccessToken: jwt.generateAccessToken,
      uploadsDir: _imageUploader.default.fullAvatarsDir
    }));
    app.use('/api/posts', (0, _posts.default)({
      s3,
      database,
      authorize: jwt.authenticateJWT,
      upload: _imageUploader.default.uploadPosts,
      uploadsDir: _imageUploader.default.fullPostsDir
    }));
    app.use('/api/status', (0, _status.default)({
      database
    }));

    function handleFileRequest(filePath, res) {
      _fs.default.access(filePath, err => {
        if (err) {
          console.log("The file does not exist.");
          res.sendStatus(404);
          return;
        }

        res.sendFile(filePath);
      });
    }

    function getImage(req, res, next) {
      try {
        var {
          fileKey
        } = req.params;
        var stream = s3.getStream({
          fileKey
        });
        stream.pipe(res);
      } catch (error) {
        console.log(error);
        res.status(500).send({
          error: JSON.stringify(error)
        });
      }
    }

    app.get('/images/posts/:fileKey', getImage);
    app.get('/images/avatars/:fileKey', jwt.authenticateJWT, getImage);
    app.get('*', (req, res) => {
      res.sendFile(_path.default.join(__dirname, '../build/index.html'));
    });
    return app;
  });
  return _ref.apply(this, arguments);
}