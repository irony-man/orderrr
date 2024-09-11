const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
 pincode: Object,
 fullAddress: Object,
 owner: {
  type: Schema.Types.ObjectId,
  ref: 'user',
 },
});

const Address = new mongoose.model("address", addressSchema);

module.exports = Address;