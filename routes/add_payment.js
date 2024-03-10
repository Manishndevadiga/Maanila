const express = require("express");
const router = express.Router();

const add_payment = require("../controllers/add_payment.js");

router.post("/add_payment", add_payment.add_payment);

module.exports = router;
