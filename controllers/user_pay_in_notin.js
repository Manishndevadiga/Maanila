const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");
const Payments = require("../models/payment");

module.exports = {
  user_pay_in_notin: async (req, res) => {
    const enteredName = req.body.name;

    const peopleData = await Peoples.find({});
    const peopleNamesLower = peopleData.map((group) =>
      group.name.toLowerCase()
    );

    const peoplePayData = await Payments.find({});
    const peoplePayNamesLower = peoplePayData.map((group) =>
      group.name.toLowerCase()
    );

    const enteredNameLower = enteredName.toLowerCase();

    // Check if the entered name is present in peopleNames and not present in peoplePayNames

    if (
      peopleNamesLower.includes(enteredNameLower) &&
      !peoplePayNamesLower.includes(enteredNameLower)
    ) {
      const userData = peopleData.find(
        (group) => group.name.toLowerCase() === enteredNameLower
      );
      console.log(userData);
      res.json({ exists: true, userData: userData }); // Send user data along with exists status
    } else {
      res.json({ exists: false });
    }
  },
};
