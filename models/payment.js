const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  groupname: {
    type: String,
    required: true,
  },
  mothername: {
    type: String,
  },
  mobileNo: {
    type: String,
  },
  account_created: {
    type: String,
    default: Date.now,
  },
  net_amount: {
    type: Number,
  },
  monthly_pay: {
    2022: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    2023: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2024: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2025: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2026: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2027: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2028: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2029: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2030: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  yearly_pay: {
    2022: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    2023: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2024: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2025: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2026: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2027: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2028: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2029: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    2030: [
      {
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  donation: [
    {
      amount: { type: Number },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Payments = mongoose.model("Payments", paymentSchema);

module.exports = Payments;
