const express = require("express");
const router = express.Router();

const calculate = require("../controllers/calculate.js");

router.post("/calculate", calculate.calculate);

module.exports = router;
