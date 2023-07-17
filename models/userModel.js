const mongoose = require("mongoose");

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
  type: String,
  required: true
 },
 picture: {
  link: {
   type: String,
   default: process.env.DEFAULT_IMG
  },
  id: {
   type: String,
  },
 },
 designs: [{
  type: Schema.Types.ObjectId,
  ref: "design",
 }, ],
 wishlist: [{
  type: Schema.Types.ObjectId,
  ref: "design",
 }, ],
 cart: [{
  type: Schema.Types.ObjectId,
  ref: "design",
 }],
});

const User = new mongoose.model("user", userSchema);

module.exports = User;