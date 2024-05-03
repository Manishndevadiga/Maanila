const express = require("express");
const router = express.Router();

const transaction = require("../controllers/transactionController");

router.get("/transaction", transaction.transaction);
router.get("/delete_transaction", transaction.delete_transaction_get);
router.post("/delete_transaction", transaction.delete_transaction);

module.exports = router;
