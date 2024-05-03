const express = require("express");
const router = express.Router();

const budget = require("../controllers/budgetController");

router.post("/check_issued_year", budget.check_issued_year);
router.get("/issue_budget", budget.issue_budget);
router.post("/issue_budget", budget.issue_budget_post);

module.exports = router;
