const express = require("express");
const router = express.Router();

const find_users = require("../controllers/find_users.js");

router.post("/find_users", find_users.find_users);

module.exports = router;
