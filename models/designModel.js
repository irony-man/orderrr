const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const designSchema = new Schema({
 type: {
  type: String,
  required: true,
 },
 title: {
  type: String,
  required: true
 },
 description: {
  type: String,
 },
 price: {
  type: Number
 },
 image: {
  full: String,
  thumb: String,
  public_id: String
 },
 created: {
  type: String,
 },
 owner: {
  type: Schema.Types.ObjectId,
  ref: 'user',
 },
});

designSchema.plugin(mongoosePaginate);
const Design = new mongoose.model("design", designSchema);

module.exports = Design;