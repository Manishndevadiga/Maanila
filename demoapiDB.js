require("dotenv").config();
const { connectMongoDB } = require("./connection");
const mongoURI = process.env.MONGODB_URL;
connectMongoDB(mongoURI);
const Demo = require("./models/demoApi");

const demodata = require("./demoapi.json");

const start = async () => {
  try {
    const res = await Demo.insertMany(demodata);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
start();
