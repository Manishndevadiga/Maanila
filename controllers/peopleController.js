const path = require("path");
const excelJS = require("exceljs");
const Payments = require("../models/payment");
const Peoples = require("../models/peoples");
const Groups = require("../models/group");
const { setuser } = require("../service/auth");
const logger = require("../logger");

module.exports = {
  get_people_form: async (req, res) => {
    // console.log(
    //   "This is the user object obtained from the jwt token",
    //   req.user
    // );
    res.render("pplform");
  },

  post_people_form: async (req, res) => {
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
      logger.error("Events Error: Unauthenticated user", err);
      res.status(500).send("Server error");
    }
  },

  find_users: async (req, res) => {
    const search = req.body.name;
    console.log(typeof search);

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

  get_users: async (req, res) => {
    try {
      const groupName = req.query.name;

      console.log("groupName:", groupName);

      const users = await Peoples.find({ group: groupName });

      ///////////////////////////////////////////////////////

      const PaymentData = await Payments.find({ groupname: groupName });

      let totalNetAmount = 0;

      PaymentData.forEach((payment) => {
        totalNetAmount += payment.net_amount;
      });

      console.log("totalNetAmount:", totalNetAmount);

      ///////////////////////////////////////////////////////////

      const responseData = {
        users: users,
        totalNetAmount: totalNetAmount,
      };

      res.send(responseData);
    } catch (error) {
      console.error("Error fetching users:", error);
      logger.error("Error fetching users:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
  get_names: async (req, res) => {
    const peopleData = await Peoples.find({});

    const peopleNames = peopleData.map((group) => ({
      name: group.name,
    }));

    const enteredName = req.body.name;
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
  update_eligibil: async (req, res) => {
    try {
      const { selectedValue, userId } = req.body;

      const user = await Peoples.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      console.log(selectedValue);
      user.eligibilityOn = new Date();
      user.eligible = selectedValue;

      await user.save();

      res.status(200).send("User's eligibility updated successfully");
    } catch (error) {
      console.error("Error updating user eligibility:", error);
      res.status(500).send("Internal server error");
    }
  },
  update_marital: async (req, res) => {
    try {
      const { selectedValue, userId } = req.body;

      const user = await Peoples.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      console.log(selectedValue);

      user.maritalStatus = selectedValue;

      await user.save();

      res.status(200).send("User's maritalStatus updated successfully");
    } catch (error) {
      console.error("Error updating user maritalStatus:", error);
      res.status(500).send("Internal server error");
    }
  },

  user_details: async (req, res) => {
    // const payload = {
    //   name: "manish",
    //   age: 22,
    //   exp: Math.floor(Date.now() / 1000) + 60, // Set expiration time to 1 minute from now
    // };
    // const token = setuser(payload);
    // // res.cookie("tokenname", token);
    // res.setHeader(
    //   "Set-Cookie",
    //   `token_name=${token}; Max-Age=3600; Path=/people/peopleForm; HttpOnly`
    // );
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.set('Content-Type', 'text/plain');
    res.render("user_details");
  },

  download: async (req, res) => {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    const peopleData = await Peoples.find({});

    worksheet.columns = [
      { header: "Name", key: "name", width: 10 },
      { header: "MotherName", key: "motherName", width: 10 },
      { header: "Age", key: "age", width: 10 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Mobile Number", key: "mobileNo", width: 15 },
      { header: "Marital Status", key: "maritalStatus", width: 10 },
      { header: "Job", key: "job", width: 10 },
      { header: "Address", key: "address", width: 10 },
      { header: "Group", key: "group", width: 10 },
      { header: "Eligible", key: "eligible", width: 15 },
      { header: "Eligibility Date", key: "eligibilityOn", width: 10 },
    ];

    worksheet.addRows(peopleData);

    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=people.xlsx"
        );
        res.send(buffer);
      })
      .catch((err) => {
        console.error("Error generating Excel file:", err);
        res.status(500).send("Error generating Excel file");
      });
  },

  admin_dashboard: (req, res) => {
    res.render("admin_dashboard");
  },
};
