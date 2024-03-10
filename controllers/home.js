const path = require("path");
const Groups = require("../models/group");

module.exports = {
  get_home: async (req, res) => {
    res.render("home");
  },
};
