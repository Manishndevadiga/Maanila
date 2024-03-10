const express = require("express");
const router = express.Router();

const checkName = require("../controllers/check-name.js");

router.post("/check-name", checkName.get_names);

module.exports = router;
