const express = require("express");
const router = express.Router();

const issue_budget = require("../controllers/issue_budget.js");

router.get("/issue_budget", issue_budget.issue_budget);

router.post("/issue_budget", issue_budget.issue_budget_post);

module.exports = router;
