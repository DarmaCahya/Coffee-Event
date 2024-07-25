const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const db = require("../models/index.js");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRole().then(role => {
      if (role.name === "admin") {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
    });
  });
};

isJury = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRole().then(role => {
      if (role.name === "jury") {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Jury Role!"
      });
    });
  });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isJury: isJury,
};
module.exports = authJwt;
