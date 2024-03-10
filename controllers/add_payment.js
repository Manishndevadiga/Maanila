const path = require("path");
const Payments = require("../models/payment");
const Peoples = require("../models/peoples");
const Budget = require("../models/budget");

module.exports = {
  add_payment: async (req, res) => {
    const username = req.body.name;
    console.log(username);

    const uniqueYears = await Budget.distinct("issuedYear");
    console.log(uniqueYears);

    const userData = await Peoples.findOne({ name: username });

    const userPayData = await Payments.findOne({ name: username });

    eligibility = userData.eligible;

    console.log(userPayData);

    console.log(eligibility);

    if (eligibility === "false") {
      eligibility = false;
    }

    if (eligibility && userPayData) {
      res.json({ exists: true, uniqueYears: uniqueYears });
    } else {
      res.json({ exists: false, uniqueYears: uniqueYears });
    }
  },
};
