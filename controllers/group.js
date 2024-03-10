const path = require("path");
const Groups = require("../models/group");

module.exports = {
  get_group: async (req, res) => {
    console.log("groups");
    res.render("groupForm");
  },
  post_group: async (req, res) => {
    const { name, head, place } = req.body;
    console.log(name, head, place);

    const newPerson = new Groups({ name, head, place });
    try {
      await newPerson.save();

      res.render("home");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },
};
