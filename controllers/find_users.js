const path = require("path");
const Peoples = require("../models/peoples");

module.exports = {
  find_users: async (req, res) => {
    const search = req.body.name;
    console.log(search);

    const peopleData = await Peoples.find({
      name: { $regex: search, $options: "i" },
    });

    console.log(peopleData);
    if (!peopleData || peopleData.length === 0) {
      res.json({ exists: false });
    } else {
      res.status(201).json({ exists: true, peopleData: peopleData });
    }
  },
};
