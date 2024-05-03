const path = require("path");
const fs = require("fs");
const Payments = require("../models/payment");
const Peoples = require("../models/peoples");
const Groups = require("../models/group");
const Demo = require("../models/demoApi");

module.exports = {
  get_home: (req, res) => {
    res.render("home");
  },

  get_home1: async (req, res) => {
    const count = await Groups.find({}).count();
    const members = await Peoples.find({}).count();
    const userArr = await Payments.find({}).limit(3);
    console.log(count);
    console.log(members);
    const arr = await Payments.find();

    let netMonthly = 0;
    let netYearly = 0;

    arr.map((user) => {
      const user1 = user.monthly_pay[2024];
      user1.forEach((obj) => {
        netMonthly += obj.amount;
      });
    });

    arr.map((user) => {
      const user1 = user.yearly_pay[2024];
      user1.forEach((obj) => {
        netYearly += obj.amount;
      });
    });

    const netAmount = netMonthly + netYearly;
    console.log(userArr);

    const data = {
      count: count,
      members: members,
      netAmount: netAmount,
      userArr: userArr,
    };

    res.render("home1", { data });
  },

  get_cn: (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "html", "cn.html"));
  },

  getDemoApi: async (req, res) => {
    const { company, model, price, releaseYear } = req.query;

    const obj = {};

    if (company) {
      obj.company = { $regex: company, $options: "i" };
    }
    if (model) {
      obj.model = { $regex: model, $options: "i" };
    }
    if (price) {
      obj.price = price;
    }
    if (releaseYear) {
      obj.releaseYear = releaseYear;
    }

    const data = await Demo.find(obj);
    res.set("Cache-Control", "public, max-age=86400");
    res.status(200).json({ result: data });
  },
};

// getDemoApi: async (req, res) => {
//   console.log(req.query);
//   const { fname, lname, birthday, city, postcode, boolean, sort, select } =
//     req.query;

//   const queryObj = {};

//   if (Array.isArray(fname)) {
//     queryObj.fname = fname;
//   }
//   // { $regex: fname, $options: "i" };
//   if (lname) {
//     queryObj.lname = lname;
//   }
//   if (birthday) {
//     queryObj.birthday = birthday;
//   }
//   if (city) {
//     queryObj.city = { $regex: city, $options: "i" };
//   }
//   if (postcode) {
//     queryObj.postcode = postcode;
//   }
//   if (boolean) {
//     queryObj.boolean = boolean;
//   }

//   console.log("........................");
//   console.log(req.headers);
//   console.log(queryObj);
//   res.set("name", "manish");
//   res.set("name1", "manish1");
//   let name = "manish n.devadiga";
//   let arr = name.split(".");
//   console.log(arr);
//   res.set({
//     name: "manish",
//     name1: "manish1",
//   });
//   res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");

//   const isEmpty = (obj) => Object.keys(obj).length === 0;

//   if (isEmpty(queryObj)) {
//     res.send("Please provide search parameters");
//   }

//   let demo = await Demo.find({});

//   if (select) {
//     const selectArr = select.split(",").join(" ");
//     demo = await Demo.find(queryObj).select(selectArr);
//   }

//   if (sort) {
//     demo = await Demo.find(queryObj).sort(sort);

//     res.status(200).json({
//       demo: demo,
//     });
//   } else {
//     res.status(200).json({
//       demo: demo,
//     });
//   }
// },
