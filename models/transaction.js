const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  name: {
    type: String,
  },
  amount: {
    type: Number,
  },
  type: {
    type: String,
  },
  year: {
    type: String,
  },
  groupname: {
    type: String,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
