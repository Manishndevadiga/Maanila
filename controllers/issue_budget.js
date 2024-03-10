const path = require("path");
const Budget = require("../models/budget");

module.exports = {
  issue_budget: async (req, res) => {
    res.render("issue_budget");
  },
  issue_budget_post: async (req, res) => {
    console.log(req.body);
    try {
      const { year, monthlyAmount, yearlyAmount, description } = req.body;

      const newBudget = new Budget({
        issuedYear: year,
        monthlyAmount: parseInt(monthlyAmount),
        yearlyAmount: parseInt(yearlyAmount),
        description: description,
      });

      await newBudget.save();

      res.redirect("/home");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error issuing budget.");
    }
  },
};
