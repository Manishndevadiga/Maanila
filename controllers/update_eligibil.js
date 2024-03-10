const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");

module.exports = {
  update_eligibil: async (req, res) => {
    try {
      const { selectedValue, userId } = req.body;

      const user = await Peoples.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      console.log(selectedValue);
      user.eligibilityOn = new Date();
      user.eligible = selectedValue;

      await user.save();

      res.status(200).send("User's eligibility updated successfully");
    } catch (error) {
      console.error("Error updating user eligibility:", error);
      res.status(500).send("Internal server error");
    }
  },
};
