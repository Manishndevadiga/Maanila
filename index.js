const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");

const { connectMongoDB } = require("./connection");
const mongoURI = "mongodb://127.0.0.1:27017/mydb1";
connectMongoDB(mongoURI);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const people = require("./routes/peoples");
app.use("/", people);

const home = require("./routes/home");
app.use("/", home);

const group = require("./routes/group");
app.use("/", group);

const groups = require("./routes/groups");
app.use("/", groups);

const checkName = require("./routes/check-name");
app.use("/", checkName);

const checkGroup = require("./routes/check-group");
app.use("/", checkGroup);

const getUsers = require("./routes/get_users");
app.use("/", getUsers);

const update_eligibil = require("./routes/update_eligibil");
app.use("/", update_eligibil);

const create_acc = require("./routes/create_acc");
app.use("/", create_acc);

const user_pay_in_notin = require("./routes/user_pay_in_notin");
app.use("/", user_pay_in_notin);

const add_payment = require("./routes/add_payment");
app.use("/", add_payment);

const payment_update = require("./routes/payment_update");
app.use("/", payment_update);

const issue_budget = require("./routes/issue_budget");
app.use("/", issue_budget);

const user_details = require("./routes/user_details");
app.use("/", user_details);

const calculate = require("./routes/calculate");
app.use("/", calculate);

const pending = require("./routes/pending");
app.use("/", pending);

const update_marital = require("./routes/update_marital");
app.use("/", update_marital);

const find_users = require("./routes/find_users");
app.use("/", find_users);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
