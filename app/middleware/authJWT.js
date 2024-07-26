const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const db = require("../models/index.js");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.session.token;
    
    console.log("Token from session:", token); 
  
    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            console.log("Token verification error:", err); 
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        console.log("Decoded token ID:", decoded.id); 
        req.user = decoded;
        next();
    });
};

isAdmin = (req, res, next) => {
    const id = req.user.id
    User.findByPk(id)
    .then(user => {
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        if (user.role === "admin") {
            req.isAdmin = true;
            next();
            return;
        }
        res.status(403).send({
            message: "Require Admin Role!"
        });
    })
    .catch(err => {
        res.status(500).send({
            message: "Unable to validate User role!"
        });
    });
};

isJury = (req, res, next) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      if (user.role === "jury" || req.isAdmin) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Jury Role!"
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Unable to validate User role!"
      });
    });
};

isAdminOrJury = (req, res, next) => {
    User.findByPk(req.user.id)
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User not found." });
        }
        if (user.role === "admin" || user.role === "jury") {
          next();
          return;
        }
  
        res.status(403).send({
          message: "Require Admin or Jury Role!"
        });
      })
      .catch(err => {
        res.status(500).send({
          message: "Unable to validate User role!"
        });
      });
  };

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isJury: isJury,
    isAdminOrJury: isAdminOrJury
};
module.exports = authJwt;
