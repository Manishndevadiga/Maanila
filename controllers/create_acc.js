const path = require("path");
const Groups = require("../models/group");
const Payments = require("../models/payment");

module.exports = {
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
      res.redirect("/create_acc");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },
};
