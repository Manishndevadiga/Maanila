const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");
const Payments = require("../models/payment");

module.exports = {
  calculate: async (req, res) => {
    const name = req.body.username;
    console.log(name);

    const user = await Payments.findOne({ name: name });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const monthly_pay = user.monthly_pay;

    const yearly_pay = user.yearly_pay;

    const donation = user.donation;

    function calculateNetAmountsDonation(donation) {
      const netAmountsDonation = {};

      donation.forEach((donation) => {
        const year = donation.timestamp.getFullYear();
        if (!netAmountsDonation[year]) {
          netAmountsDonation[year] = 0;
        }
        netAmountsDonation[year] += donation.amount;
      });

      return netAmountsDonation;
    }

    const netAmountsDonation = calculateNetAmountsDonation(donation);
    console.log(netAmountsDonation);

    function calculateNetAmounts(monthly_pay) {
      const netAmountsMonthly = {};

      for (const year in monthly_pay) {
        if (Object.hasOwnProperty.call(monthly_pay, year)) {
          const payments = monthly_pay[year];
          let totalAmount = 0;

          payments.forEach((payment) => {
            totalAmount += payment.amount;
          });

          netAmountsMonthly[year] = totalAmount;
        }
      }

      return netAmountsMonthly;
    }

    const netAmountsMonthly = calculateNetAmounts(monthly_pay);
    console.log(netAmountsMonthly);

    function calculateNetAmountsYearly(yearly_pay) {
      const netAmountsYearly = {};

      for (const year in yearly_pay) {
        if (Object.hasOwnProperty.call(yearly_pay, year)) {
          const payments = yearly_pay[year];
          let totalAmount = 0;

          payments.forEach((payment) => {
            totalAmount += payment.amount;
          });

          netAmountsYearly[year] = totalAmount;
        }
      }

      return netAmountsYearly;
    }

    const netAmountsYearly = calculateNetAmountsYearly(yearly_pay);
    console.log(netAmountsYearly);

    res.json({ netAmountsMonthly, netAmountsYearly, netAmountsDonation });
  },
};
