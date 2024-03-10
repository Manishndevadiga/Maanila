const express = require("express");
const router = express.Router();

const update_marital = require("../controllers/update_marital.js");

router.post("/update_marital", update_marital.update_marital);

module.exports = router;
