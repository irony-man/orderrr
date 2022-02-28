const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
 email: {
  type: String,
  required: true,
 },
 username: {
  type: String,
  required: true,
 },
 password: {
  type: Schema.Types.ObjectId,
  ref: 'password',
 },
 designs: [{
  type: Schema.Types.ObjectId,
  ref: 'design',
 }],
 wishlist: [{
  type: Schema.Types.ObjectId,
  ref: 'design',
 }],
 cart: [{
  type: Schema.Types.ObjectId,
  ref: 'design',
 }],
 otp: Number,
});

const User = new mongoose.model("user", userSchema);

module.exports = User;