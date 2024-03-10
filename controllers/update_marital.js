const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");

module.exports = {
  update_marital: async (req, res) => {
    try {
      const { selectedValue, userId } = req.body;

      const user = await Peoples.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      console.log(selectedValue);

      user.maritalStatus = selectedValue;

      await user.save();

      res.status(200).send("User's maritalStatus updated successfully");
    } catch (error) {
      console.error("Error updating user maritalStatus:", error);
      res.status(500).send("Internal server error");
    }
  },
};
