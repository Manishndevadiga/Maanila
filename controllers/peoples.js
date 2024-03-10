const path = require("path");
const Peoples = require("../models/peoples");
const Groups = require("../models/group");

module.exports = {
  get: async (req, res) => {
    console.log("peoples");
    res.render("pplform");
  },

  post: async (req, res) => {
    const {
      name,
      motherName,
      group,
      age,
      gender,
      mobileNo,
      maritalStatus,
      job,
      address,
    } = req.body;
    console.log(name, motherName, group);

    const groupObj = await Groups.findOne({ name: group });

    const groupId = groupObj._id;
    console.log(groupId);

    const newPerson = new Peoples({
      name,
      motherName,
      age,
      gender,
      mobileNo,
      maritalStatus,
      job,
      address,
      groupId,
      group,
    });
    try {
      await newPerson.save();
      res.redirect("/home");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },
};
