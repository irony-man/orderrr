const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passSchema = new Schema({
 value: {
  type: String,
  required: true,
 },
});

const Pass = new mongoose.model("password", passSchema);

module.exports = Pass;