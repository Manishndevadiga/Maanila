const express = require("express");
const router = express.Router();

const group = require("../controllers/group.js");

router.get("/group", group.get_group);
router.post("/group", group.post_group);

module.exports = router;
