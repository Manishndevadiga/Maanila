const express = require("express");
const router = express.Router();

const groups = require("../controllers/groups.js");

router.get("/groups", groups.get_groups);

module.exports = router;
