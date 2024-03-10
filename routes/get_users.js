const express = require("express");
const router = express.Router();

const get_users = require("../controllers/get_users.js");

router.get("/get_users", get_users.get_users);

module.exports = router;
