const express = require("express");
const router = express.Router();

const payment_update = require("../controllers/payment_update.js");

router.post("/payment_update", payment_update.payment_update);

module.exports = router;
