const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const peopleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    // enum: ["male", "female", "other"],
  },
  mobileNo: {
    type: String,
  },
  maritalStatus: {
    type: String,
    default: "Single",
    // enum: ["single", "married", "divorced", "widowed"],
  },
  job: {
    type: String,
  },
  address: {
    type: String,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
  group: {
    type: String,
  },
  eligible: {
    type: String,
    default: false,
  },
  eligibilityOn: {
    type: Date,
    default: Date.now,
  },
});

const People = mongoose.model("People", peopleSchema);

module.exports = People;
