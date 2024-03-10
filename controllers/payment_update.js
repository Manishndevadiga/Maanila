const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");
const Payments = require("../models/payment");
const Budget = require("../models/budget");

module.exports = {
  payment_update: async (req, res) => {
    const { username, paymentType, year, amount } = req.body;
    console.log(username, paymentType, year, amount);

    const currentYear = await Budget.findOne({ issuedYear: year });

    const issuedMonthlyAmt = currentYear.monthlyAmount;
    const issuedYearlyAmt = currentYear.yearlyAmount;

    if (paymentType === "donation") {
      try {
        const user = await Payments.findOne({ name: username });

        console.log(user);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        user.donation.push({
          amount: amount,
          timestamp: new Date(),
        });

        await user.save();

        return res.redirect("/home");
      } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    if (paymentType === "monthly") {
      try {
        const user = await Payments.findOne({ name: username });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const monthly_pay = user.monthly_pay[year];

        const netMonthlyAmount = monthly_pay
          .filter((entry) => entry.amount != null)
          .reduce((total, entry) => total + entry.amount, 0);

        console.log("Net Monthly Amount:", netMonthlyAmount);
        console.log("issued Monthly Amount:", issuedMonthlyAmt);

        if (netMonthlyAmount >= issuedMonthlyAmt) {
          user.donation.push({
            amount: amount,
            timestamp: new Date(),
          });

          await user.save();
          return res.redirect("/home");
        }

        const pendingAmt = issuedMonthlyAmt - netMonthlyAmount;

        if (amount > pendingAmt) {
          const remainingAmt = amount - pendingAmt;

          user.monthly_pay[year].push({
            amount: pendingAmt,
            timestamp: new Date(),
          });

          user.donation.push({
            amount: remainingAmt,
            timestamp: new Date(),
          });
        }

        if (amount <= pendingAmt) {
          user.monthly_pay[year].push({
            amount: amount,
            timestamp: new Date(),
          });
        }
        await user.save();

        return res.redirect("/home");
      } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    if (paymentType === "yearly") {
      try {
        const user = await Payments.findOne({ name: username });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const yearly_pay = user.yearly_pay[year];

        const netYearlyAmount = yearly_pay
          .filter((entry) => entry.amount != null)
          .reduce((total, entry) => total + entry.amount, 0);

        console.log("Net Monthly Amount:", netYearlyAmount);
        console.log("issued Monthly Amount:", issuedYearlyAmt);

        if (netYearlyAmount >= issuedYearlyAmt) {
          user.donation.push({
            amount: amount,
            timestamp: new Date(),
          });

          await user.save();
          return res.redirect("/home");
        }

        const pendingYearlyAmt = issuedYearlyAmt - netYearlyAmount;

        if (amount > pendingYearlyAmt) {
          const remainingYearlyAmt = amount - pendingYearlyAmt;

          user.yearly_pay[year].push({
            amount: pendingYearlyAmt,
            timestamp: new Date(),
          });

          user.donation.push({
            amount: remainingYearlyAmt,
            timestamp: new Date(),
          });
        }

        if (amount <= pendingYearlyAmt) {
          user.yearly_pay[year].push({
            amount: amount,
            timestamp: new Date(),
          });
        }

        await user.save();

        return res.redirect("/home");
      } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  },
};
