const express = require("express");
const router = express.Router();

const pending = require("../controllers/pending.js");

router.get("/pending", pending.pending_get);

router.post("/pending", pending.pending_post);

module.exports = router;
