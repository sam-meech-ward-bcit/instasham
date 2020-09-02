"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticateJWT = authenticateJWT;
exports.generateAccessToken = generateAccessToken;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var secret = process.env.ACCESS_TOKEN_SECRET || 'my secret';

function authenticateJWT(req, res, next) {
  // next(); return
  var token,
      authHeader = req.headers.authorization;

  if (authHeader) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.cookies['token'];
  }

  if (!token) {
    console.log("no token sent to server");
    res.sendStatus(401);
    return;
  }

  _jsonwebtoken.default.verify(token, secret, (err, body) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
      return;
    }

    console.log(body);
    req.user = body.user;
    next();
  });
}

function generateAccessToken(user) {
  var token = _jsonwebtoken.default.sign(user, secret, {
    expiresIn: "100000000000000000000000s"
  });

  return token;
}