const express = require("express");
const router = express.Router();

const home = require("../controllers/home.js");

router.get("/home", home.get_home);

module.exports = router;
