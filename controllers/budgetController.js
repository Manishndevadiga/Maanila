const path = require("path");
const Payments = require("../models/payment");
const Peoples = require("../models/peoples");
const Groups = require("../models/group");
const budget = require("../models/budget");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");

module.exports = {
  issue_budget: (req, res) => {
    res.render("issue_budget");
  },

  check_issued_year: AsyncErrorHandler(async (req, res, next) => {
    const year = req.body.year;

    const uniqueYears = await budget.distinct("issuedYear");
    console.log(uniqueYears);

    const DB_Years = [
      "2024",
      "2025",
      "2026",
      "2027",
      "2028",
      "2029",
      "2030",
      "2031",
      "2032",
      "2033",
      "2034",
      "2035",
      "2036",
      "2037",
      "2038",
      "2039",
      "2040",
    ];

    if (!uniqueYears.includes(year) && DB_Years.includes(year)) {
      res.json({ result: true });
    } else {
      return res.json({ result: false });
    }
  }),

  issue_budget_post: AsyncErrorHandler(async (req, res, next) => {
    const { year, monthlyAmount, yearlyAmount, description } = req.body;
    const newBudget = new budget({
      issuedYear: year,
      monthlyAmount: parseInt(monthlyAmount),
      yearlyAmount: parseInt(yearlyAmount),
      description: description,
    });
    await newBudget.save();
    res.redirect("/home");
  }),
};
