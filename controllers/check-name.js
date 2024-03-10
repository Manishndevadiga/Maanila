const path = require("path");
const Groups = require("../models/group");
const Peoples = require("../models/peoples");

module.exports = {
  get_names: async (req, res) => {
    const peopleData = await Peoples.find({});

    const peopleNames = peopleData.map((group) => ({
      name: group.name,
    }));

    const enteredName = req.body.name;
    console.log(peopleNames);
    console.log(enteredName);

    const enteredNameLower = req.body.name.toLowerCase();
    const peopleNamesLower = peopleData.map((person) =>
      person.name.toLowerCase()
    );

    if (peopleNamesLower.includes(enteredNameLower)) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  },
};
