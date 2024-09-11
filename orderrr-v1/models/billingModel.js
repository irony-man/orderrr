const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const billingSchema = new Schema({
 cardNumber: Object,
 nameOnCard: Object,
 cardName: String,
 owner: {
  type: Schema.Types.ObjectId,
  ref: 'user',
 },
});

const Billing = new mongoose.model("billing", billingSchema);

module.exports = Billing;