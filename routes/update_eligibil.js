const express = require("express");
const router = express.Router();

const update_eligibil = require("../controllers/update_eligibil.js");

router.post("/update_eligibil", update_eligibil.update_eligibil);

module.exports = router;
