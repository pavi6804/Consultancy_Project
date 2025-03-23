const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  company: { type: String, required: true },
  transactionType: { type: String, enum: ["Purchase", "Sale"], required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
