const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const demoSchema = new Schema({
  company: {
    type: String,
  },
  model: {
    type: String,
  },
  releaseYear: {
    type: Number,
  },
  price: {
    type: Number,
  },
});

const DemoApi = mongoose.model("DemoApi", demoSchema);

module.exports = DemoApi;
