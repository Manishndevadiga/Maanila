const path = require("path");
const Payments = require("../models/payment");
const Peoples = require("../models/peoples");
const Groups = require("../models/group");
const budget = require("../models/budget");
const Transaction = require("../models/transaction");

const fs = require("fs");
const ejs = require("ejs");
const pdf = require("html-pdf");

module.exports = {
  add_payment: async (req, res) => {
    const username = req.body.name;
    console.log(username);

    const uniqueYears = await budget.distinct("issuedYear");
    console.log(uniqueYears);

    const userData = await Peoples.findOne({ name: username });

    console.log(userData);
    const userPayData = await Payments.findOne({
      name: username,
    });

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

  create_acc: async (req, res) => {
    res.render("create_acc");
  },
  create_acc_post: async (req, res) => {
    console.log(req.body);
    const { username, groupname, mothername, mobileNo } = req.body;
    console.log(username, groupname, mothername, mobileNo);

    try {
      const newAccount = new Payments({
        name: username,
        groupname: groupname,
        mothername: mothername,
        mobileNo: mobileNo,
      });

      await newAccount.save();
      res.redirect("/payment/create_acc");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  payment_update: async (req, res) => {
    const { username, paymentType, year, amount } = req.body;
    console.log(username, paymentType, year, amount);

    const currentYear = await budget.findOne({ issuedYear: year });

    const issuedMonthlyAmt = currentYear.monthlyAmount;
    const issuedYearlyAmt = currentYear.yearlyAmount;

    if (paymentType === "donation") {
      try {
        const user = await Payments.findOne({ name: username });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        console.log(typeof user.net_amount);

        console.log(typeof amount);

        user.net_amount = user.net_amount + amount;

        user.donation.push({
          amount: amount,
          timestamp: new Date(),
        });

        await user.save();

        //////////////////////////////////////////////////////////////////////////////
        const newTransaction = new Transaction({
          name: username,
          amount: amount,
          type: paymentType,
          groupname: user.groupname,
          year: year,
          date: new Date(),
        });

        newTransaction.save();
        ///////////////////////////////////////////////////////////////////////////////

        return res.json({
          success: true,
          amount: amount,
          name: username,
          type: "ಧನ ಸಹಾಯ(Donation)",
        });
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
        console.log(user);
        console.log(monthly_pay);

        const netMonthlyAmount = monthly_pay
          .filter((entry) => entry.amount != null)
          .reduce((total, entry) => total + entry.amount, 0);

        console.log("Net Monthly Amount:", netMonthlyAmount);
        console.log("issued Monthly Amount:", issuedMonthlyAmt);

        if (netMonthlyAmount >= issuedMonthlyAmt) {
          user.net_amount = user.net_amount + amount;

          user.donation.push({
            amount: amount,
            timestamp: new Date(),
          });

          await user.save(); //no need
          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
          return res.json({
            success: true,
            amount: amount,
            name: username,
            type: "ತಿಂಗಳಿನ ಶುಲ್ಕ(Monthly Fees)",
          });
        }

        //if admin update and decrease the budget then it will not execute these codes and if (netMonthlyAmount >= issuedMonthlyAmt)  this becomes true

        const pendingAmt = issuedMonthlyAmt - netMonthlyAmount;

        if (amount > pendingAmt) {
          user.net_amount = user.net_amount + amount;

          const remainingAmt = amount - pendingAmt;

          user.monthly_pay[year].push({
            amount: pendingAmt,
            timestamp: new Date(),
          });

          user.donation.push({
            amount: remainingAmt,
            timestamp: new Date(),
          });

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
        }

        if (amount <= pendingAmt) {
          user.net_amount = user.net_amount + amount;

          user.monthly_pay[year].push({
            amount: amount,
            timestamp: new Date(),
          });

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
        }
        await user.save();

        return res.json({
          success: true,
          amount: amount,
          name: username,
          type: "ತಿಂಗಳಿನ ಶುಲ್ಕ(Monthly Fees)",
        });
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
          user.net_amount = user.net_amount + amount;

          user.donation.push({
            amount: amount,
            timestamp: new Date(),
          });

          await user.save();

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
          return res.json({
            success: true,
            amount: amount,
            name: username,
            type: "ವಾರ್ಷಿಕ ನೆಮೋತ್ಸವ(Annual Nemothsava)",
          });
        }

        const pendingYearlyAmt = issuedYearlyAmt - netYearlyAmount;

        if (amount > pendingYearlyAmt) {
          user.net_amount = user.net_amount + amount;

          const remainingYearlyAmt = amount - pendingYearlyAmt;

          user.yearly_pay[year].push({
            amount: pendingYearlyAmt,
            timestamp: new Date(),
          });

          user.donation.push({
            amount: remainingYearlyAmt,
            timestamp: new Date(),
          });

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
        }

        if (amount <= pendingYearlyAmt) {
          user.net_amount = user.net_amount + amount;

          user.yearly_pay[year].push({
            amount: amount,
            timestamp: new Date(),
          });

          ///////////////////////////////////////////////////////////////////////////////////
          const newTransaction = new Transaction({
            name: username,
            amount: amount,
            type: paymentType,
            groupname: user.groupname,
            year: year,
            date: new Date(),
          });

          newTransaction.save();

          ///////////////////////////////////////////////////////////////////////////////////
        }

        await user.save();

        return res.json({
          success: true,
          amount: amount,
          name: username,
          type: "ವಾರ್ಷಿಕ ನೆಮೋತ್ಸವ(Annual Nemothsava)",
        });
      } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  },

  pending_get: async (req, res) => {
    res.render("pending_status");
  },

  pending_post: async (req, res) => {
    const { selectedYear, selectedGroupName } = req.body;
    console.log(selectedYear);
    console.log(selectedGroupName);

    const groupsData = await budget.findOne({ issuedYear: selectedYear });

    const monthlyIssuedAmt = groupsData.monthlyAmount;
    const yearlyIssuedAmt = groupsData.yearlyAmount;

    const groups = await Payments.find({ groupname: selectedGroupName });

    ////////////////////////////////////////////////////////////////////////////////////

    function getUserNames(peopleDetails) {
      const userNames = peopleDetails.map((user) => user.name);
      return userNames;
    }

    const peopleDetails = await Peoples.find({ eligible: "true" });
    const userNames = getUserNames(peopleDetails);
    console.log(userNames);

    //////////////////////////////////////////////////////////////////////////////////////

    const calculateNetPayments = (user, year, userNames) => {
      if (userNames.includes(user.name)) {
        // user is one document in the payment model

        const monthlyPayments = user.monthly_pay[year] || [];
        const yearlyPayments = user.yearly_pay[year] || [];

        const netMonthlyAmount = monthlyPayments.reduce(
          (total, payment) => total + payment.amount,
          0
        );
        const netYearlyAmount = yearlyPayments.reduce(
          (total, payment) => total + payment.amount,
          0
        );

        return {
          user: user.name,
          net_monthly_amt: netMonthlyAmount,
          net_yearly_amt: netYearlyAmount,
        };
      } else {
        return null; // User is not eligible
      }
    };

    const calculateNetPaymentsForYear = (groups, year, userNames) => {
      const netPayments = [];
      for (const user of groups) {
        const paymentInfo = calculateNetPayments(user, year, userNames);
        netPayments.push(paymentInfo);
      }
      return netPayments;
    };

    const netPaymentsForYear = calculateNetPaymentsForYear(
      groups,
      selectedYear,
      userNames // Pass the userNames array here
    );
    console.log(netPaymentsForYear);

    /////////////////////////////////////////////////////////////////////////////////////////

    function checkPendingStatus(user) {
      const monthlyPending = monthlyIssuedAmt - user.net_monthly_amt;
      const yearlyPending = yearlyIssuedAmt - user.net_yearly_amt;

      const userDetailsObj = {
        user: user.user,
        monthly_pending: monthlyPending,
        yearly_pending: yearlyPending,
      };

      return userDetailsObj;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    function selectUsers(userArray) {
      const validUsers = userArray.filter(
        (user) => user !== null && user !== undefined
      );

      const userDetails = [];

      if (validUsers.length > 0) {
        validUsers.forEach((user) => {
          const userDetailsObj = checkPendingStatus(user);

          userDetails.push(userDetailsObj);
        });
        return userDetails;
      } else {
        console.log("No valid users found in the array.");
      }
    }

    const result = selectUsers(netPaymentsForYear);

    // Check if result is undefined
    if (result === undefined) {
      res.status(404).json({ error: "User not found" });
    } else {
      function filterPendingUsers(result) {
        return result.filter(
          (user) => user.monthly_pending > 0 || user.yearly_pending > 0
        );
      }

      const filteredResult = filterPendingUsers(result);

      console.log(filteredResult);

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      res.json({
        filteredResult,
      });
    }
  },

  user_pay_in_notin: async (req, res) => {
    const enteredName = req.body.name;

    const peopleData = await Peoples.find({});
    const peopleNames = peopleData.map((group) => group.name);

    const peoplePayData = await Payments.find({});
    const peoplePayNames = peoplePayData.map((group) => group.name);

    console.log(peoplePayNames);
    console.log(peopleNames);

    if (
      peopleNames.includes(enteredName) &&
      !peoplePayNames.includes(enteredName)
    ) {
      const userData = peopleData.find((group) => group.name === enteredName);
      console.log(userData);
      res.json({ exists: true, userData: userData }); // Send user data along with exists status
    } else {
      res.json({ exists: false });
    }
  },
  generate_bill: async (req, res) => {
    try {
      const { name, amount, type } = req.body;

      console.log(name, amount);

      let user = await Peoples.findOne({ name: name });

      if (!user) throw Error("User not found");

      const ejsFilePath = path.join(__dirname, "..", "views", "bill.ejs");

      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });

      // Render EJS template to HTML
      const html = await ejs.renderFile(ejsFilePath, {
        user: user,
        amount: amount,
        date: formattedDate,
        type: type,
      });

      // Create PDF from HTML content
      pdf.create(html).toBuffer((err, buffer) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error generating PDF");
        }

        // Set response headers to indicate PDF content
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=bill.pdf");

        // Stream PDF buffer back to the client
        res.send(buffer);
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(404);
    }
  },
};
