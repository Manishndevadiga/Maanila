const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");

module.exports = {
  get_group: async (req, res) => {
    const groupsData = await Groups.find({});

    const newgroupsData = groupsData.map((group) => ({
      name: group.name,
    }));
    // console.log(newgroupsData);
    const enteredName = req.body.name;
    // console.log(enteredName);
    const enteredNameLower = req.body.name.toLowerCase();
    const peopleNamesLower = newgroupsData.map((person) =>
      person.name.toLowerCase()
    );
    // console.log(peopleNamesLower);
    if (peopleNamesLower.includes(enteredNameLower)) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  },
};
