const express = require("express");
const router = express.Router();

const user_pay_in_notin = require("../controllers/user_pay_in_notin.js");

router.post("/user_pay_in_notin", user_pay_in_notin.user_pay_in_notin);

module.exports = router;
