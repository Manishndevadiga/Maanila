const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  head: {
    type: String,
    required: true,
  },
  place: {
    type: String,
  },
});

const Groups = mongoose.model("Groups", GroupSchema);

module.exports = Groups;
