const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");
const Payments = require("../models/payment");

module.exports = {
  get_users: async (req, res) => {
    try {
      const groupName = req.query.name;

      // const groups = await Payments.find({ groupname: groupName });

      console.log("groupName:", groupName);

      const users = await Peoples.find({ group: groupName });

      res.send(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
};
