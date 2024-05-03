const express = require("express");
const router = express.Router();

const payments = require("../controllers/paymentController");

router.get("/peopleForm", payments.add_payment);
router.post("/calculate", payments.calculate);
router.get("/create_acc", payments.create_acc);
router.post("/create_acc", payments.create_acc_post);
router.post("/payment_update", payments.payment_update);
router.get("/pending", payments.pending_get);
router.post("/pending", payments.pending_post);
router.post("/user_pay_in_notin", payments.user_pay_in_notin);
router.post("/add_payment", payments.add_payment);
router.post("/generate_bill", payments.generate_bill);

module.exports = router;
