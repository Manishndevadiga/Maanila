const express = require("express");
const router = express.Router();

const peoples = require("../controllers/peoples.js");

router.get("/", peoples.get);
router.post("/", peoples.post);

module.exports = router;
