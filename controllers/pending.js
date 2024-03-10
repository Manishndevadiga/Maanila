const path = require("path");
const Groups = require("../models/group");
const Payments = require("../models/payment");
const Budget = require("../models/budget");
const Peoples = require("../models/peoples");

module.exports = {
  pending_get: async (req, res) => {
    res.render("pending_status");
  },

  pending_post: async (req, res) => {
    const { selectedYear, selectedGroupName } = req.body;
    console.log(selectedYear);
    console.log(selectedGroupName);

    const groupsData = await Budget.findOne({ issuedYear: selectedYear });

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
};
