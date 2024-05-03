const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
  issuedYear: {
    type: String,
    required: true,
    unique: true,
  },
  monthlyAmount: {
    type: Number,
    required: true,
  },
  yearlyAmount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
