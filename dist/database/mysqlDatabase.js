"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeSession = storeSession;
exports.status = status;
exports.end = end;
exports.run = run;
exports.getPosts = getPosts;
exports.getPost = getPost;
exports.createPost = createPost;
exports.likePost = likePost;
exports.addComment = addComment;
exports.getUser = getUser;
exports.getUserWithEmail = getUserWithEmail;
exports.createUser = createUser;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _mysql = _interopRequireDefault(require("mysql"));

var _expressMysqlSession = _interopRequireDefault(require("express-mysql-session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var dbDetails = {
  connectionLimit: 10,
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'instasam'
};

var connection = _mysql.default.createPool(dbDetails);

function storeSession(_x) {
  return _storeSession.apply(this, arguments);
}

function _storeSession() {
  _storeSession = _asyncToGenerator(function* (_ref) {
    var {
      session
    } = _ref;
    var Store = (0, _expressMysqlSession.default)(session);
    return new Promise((resolve, reject) => {
      connection.getConnection(function (err, connection) {
        if (err) {
          resolve(null);
          return;
        }

        var sessionStore = new Store({}
        /* session store options */
        , connection);
        resolve(sessionStore);
      });
    });
  });
  return _storeSession.apply(this, arguments);
}

function status() {
  return _status.apply(this, arguments);
}

function _status() {
  _status = _asyncToGenerator(function* () {
    return new Promise((resolve, reject) => {
      connection.getConnection(function (err, connection) {
        if (err) {
          reject(err);
          return;
        }

        resolve(_objectSpread(_objectSpread({}, connection), {}, {
          host: dbDetails.host,
          database: dbDetails.database
        }));
        connection.end();
      });
    });
  });
  return _status.apply(this, arguments);
}

function end() {
  connection.end();
}

function dateCompare(d1, d2) {
  var date1 = new Date(d1);
  var date2 = new Date(d2);
  return date2 - date1;
}

function parsePost(post) {
  return _objectSpread(_objectSpread({}, post), {}, {
    media: (JSON.parse(post.media) || []).filter(a => a),
    // Cause mysql will put null into an array
    comments: (JSON.parse(post.comments) || []).filter(a => a).sort((a, b) => dateCompare(a.created, b.created)),
    user: JSON.parse(post.user) || {}
  });
}

function parseComment(comment) {
  return _objectSpread(_objectSpread({}, comment), {}, {
    user: JSON.parse(comment.user) || {}
  });
}

function run(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, null, function (error, results, fields) {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });
}

function _callProcedure(callback, name) {
  for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    params[_key - 2] = arguments[_key];
  }

  var query = "CALL ".concat(name, "(").concat(params.map(() => '?').join(', '), ")");
  console.log(query, params);
  connection.query(query, params, function (error, results, fields) {
    if (error) {
      console.log(query, error);
      return callback(error);
    }

    callback(null, results[0]);
  });
}

function callProcedure(name) {
  for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    params[_key2 - 1] = arguments[_key2];
  }

  return new Promise((resolve, reject) => {
    _callProcedure((err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    }, name, ...params);
  });
}

function getPosts(_ref2) {
  var {
    userId,
    limit
  } = _ref2;
  return callProcedure('get_posts', limit, userId).then(rows => rows.map(parsePost));
}

function getPost(_ref3) {
  var {
    postId,
    userId
  } = _ref3;
  return callProcedure('get_post', postId, userId).then(rows => parsePost(rows[0]));
}

function createPost(_x2) {
  return _createPost.apply(this, arguments);
}

function _createPost() {
  _createPost = _asyncToGenerator(function* (_ref4) {
    var {
      userId,
      description,
      media
    } = _ref4;
    media = [...media];
    var fistImage = media.shift();
    var result = yield callProcedure('create_post', userId, description, fistImage.type, fistImage.url);
    var post = result[0];
    var order = 2;

    for (var image of media) {
      yield callProcedure('add_media_to_post', post.id, image.type, order++, image.url);
    }

    return yield getPost({
      postId: post.id,
      userId
    });
  });
  return _createPost.apply(this, arguments);
}

function likePost(_x3) {
  return _likePost.apply(this, arguments);
}

function _likePost() {
  _likePost = _asyncToGenerator(function* (_ref5) {
    var {
      likerId,
      postId,
      userId
    } = _ref5;
    yield callProcedure('like_post', likerId, postId);
    return yield getPost({
      postId,
      userId
    });
  });
  return _likePost.apply(this, arguments);
}

function addComment(_x4) {
  return _addComment.apply(this, arguments);
} // export async function likeComment({ userId, commentId }) {
//   await callProcedure('like_comment', userId, postId)
//   return await getPost({postId})
// }


function _addComment() {
  _addComment = _asyncToGenerator(function* (_ref6) {
    var {
      userId,
      postId,
      message
    } = _ref6;
    return yield callProcedure('add_comment', userId, postId, message).then(rows => parseComment(rows[0]));
  });
  return _addComment.apply(this, arguments);
}

function getUser(options) {
  return (options.id ? callProcedure('get_user_with_id', options.id) : callProcedure('get_user_with_email', options.email)).then(rows => {
    var user = rows[0];

    if (!user) {
      throw Error("Invalid email");
    }

    if (!options.password) {
      return user;
    }

    return new Promise((resolve, reject) => {
      _bcryptjs.default.compare(options.password, user.password, (err, same) => {
        if (err) {
          reject(err);
          return;
        }

        if (same) {
          resolve(user);
        } else {
          reject(Error("Passwords don't match"));
        }
      });
    });
  });
}

function getUserWithEmail(email) {
  return getUser({
    email
  });
}

function createUser(_ref7) {
  var {
    email,
    username,
    password,
    fullName
  } = _ref7;
  return new Promise((resolve, reject) => {
    _bcryptjs.default.hash(password, 12, (error, encrypted) => {
      if (error) {
        reject(error);
        return;
      }

      callProcedure('create_user', username, encrypted, email, fullName).then(rows => resolve(rows[0])).catch(reject);
    });
  });
}