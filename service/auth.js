const jwt = require("jsonwebtoken");
require("dotenv").config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

function setuser(payload) {
  console.log(payload);
  return jwt.sign(payload, TOKEN_SECRET);
}

function getuser(token) {
  return jwt.verify(token, TOKEN_SECRET);
}

module.exports = {
  setuser,
  getuser,
};
