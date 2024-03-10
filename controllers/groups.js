const path = require("path");
const Groups = require("../models/group");
const Budget = require("../models/budget");

module.exports = {
  get_groups: async (req, res) => {
    const groupsData = await Groups.find({});

    const uniqueYears = await Budget.distinct("issuedYear");
    console.log(uniqueYears);

    const formattedGroups = groupsData.map((group) => ({
      id: group._id,
      name: group.name,
    }));

    res.json({ groups: formattedGroups, uniqueYears: uniqueYears });
  },
};
