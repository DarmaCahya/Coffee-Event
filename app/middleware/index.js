const verifySignUp = require("./verifySignUp");
const authJwt = require("./authJWT");
const verifyPin = require("./verifyPin");

module.exports = {
  authJwt,
  verifySignUp,
  verifyPin
};