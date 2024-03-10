const express = require("express");
const router = express.Router();

const create_acc = require("../controllers/create_acc.js");

router.get("/create_acc", create_acc.create_acc);
router.post("/create_acc", create_acc.create_acc_post);

module.exports = router;
