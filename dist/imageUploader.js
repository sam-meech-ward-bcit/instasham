"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var _imageSize = _interopRequireDefault(require("image-size"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uploadPostsRouter = _express.default.Router();

var publicPath = _path.default.join(__dirname, '../public');

var uploadsDir = 'uploads';
var postsDir = 'posts';
var avatarsDir = 'avatars';

var postsPath = _path.default.join(uploadsDir, postsDir);

exports.postsPath = postsPath;

var imageSizer = (req, res, next) => {
  if (req.file) {
    req.image = {};
    req.image.path = _path.default.join(postsPath, req.file.filename);
    req.image.size = (0, _imageSize.default)(_path.default.join(publicPath, req.image.path));
  }

  next();
};

var fullPostsDir = _path.default.join(publicPath, uploadsDir, postsDir);

var uploadPostsMutler = (0, _multer.default)({
  dest: fullPostsDir
}).array('images');
uploadPostsRouter.use(uploadPostsMutler);
uploadPostsRouter.use(imageSizer);

var fullAvatarsDir = _path.default.join(publicPath, uploadsDir, avatarsDir);

var uploadAvatar = (0, _multer.default)({
  dest: fullAvatarsDir
}).single('avatar');
var _default = {
  uploadPosts: uploadPostsRouter,
  fullPostsDir,
  uploadAvatar,
  fullAvatarsDir
};
exports.default = _default;