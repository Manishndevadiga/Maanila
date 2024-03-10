const express = require("express");
const router = express.Router();

const checkGroup = require("../controllers/check-group.js");

router.post("/check-group", checkGroup.get_group);

module.exports = router;
