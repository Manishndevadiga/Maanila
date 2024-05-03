const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const path = require("path");
const logger = require("./logger");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const url = require("url");

const { connectMongoDB } = require("./connection");
// const mongoURI = "mongodb://127.0.0.1:27017/mydb1";
const mongoURI = process.env.MONGODB_URL;
connectMongoDB(mongoURI);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const homeRoutes = require("./routes/homeRoutes");
const peopleRoutes = require("./routes/peopleRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const groupRoutes = require("./routes/groupRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const CustomError = require("./Utils/CustomError");
const globalErrorHandler = require("./controllers/errorController");
const logFlush = require("./Utils/logFlush");

// const { dummy } = require("./middlewares/dummyMiddleware");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //used in middlewares
app.use(cors());

// app.use(dummy);

app.use((req, res, next) => {
  const { query } = url.parse(req.url, true);
  req.query = query;
  req.requestTime = new Date();
  next();
});

app.use("/", homeRoutes);
app.use("/people", peopleRoutes);
app.use("/payment", paymentRoutes);
app.use("/budget", budgetRoutes);
app.use("/group", groupRoutes);
app.use("/transaction", transactionRoutes);

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `The path you requested is not found - ${req.originalUrl}`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  logger.info(`Server is running on port ${PORT}`);
});
