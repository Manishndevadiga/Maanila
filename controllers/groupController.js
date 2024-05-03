const path = require("path");
const Payments = require("../models/payment");
const Peoples = require("../models/peoples");
const Groups = require("../models/group");
const budget = require("../models/budget");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");

module.exports = {
  get_group_form: (req, res) => {
    res.render("groupForm");
  },

  post_group_form: AsyncErrorHandler(async (req, res, next) => {
    const { name, head, place } = req.body;
    const newPerson = new Groups({ name, head, place });
    await newPerson.save();
    res.redirect("/group/groupForm");
  }),

  get_group: AsyncErrorHandler(async (req, res) => {
    const groupsData = await Groups.find({});
    const newgroupsData = groupsData.map((group) => ({
      name: group.name,
    }));
    const enteredName = req.body.name;
    const enteredNameLower = req.body.name.toLowerCase();
    const peopleNamesLower = newgroupsData.map((person) =>
      person.name.toLowerCase()
    );
    if (peopleNamesLower.includes(enteredNameLower)) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  }),

  get_groups: AsyncErrorHandler(async (req, res, next) => {
    const groupsData = await Groups.find({});
    const uniqueYears = await budget.distinct("issuedYear");
    console.log(uniqueYears);
    const formattedGroups = groupsData.map((group) => ({
      id: group._id,
      name: group.name,
    }));
    res.json({ groups: formattedGroups, uniqueYears: uniqueYears });
  }),
};
