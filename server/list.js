// list.js
const mongoose = require('./db');

const listSchema = new mongoose.Schema({
  name: String,
  superheroes: [String], // Change the data type as needed
  user: { type: String, required: true }, // Change the type to String
  desc: String,
  visibility: String,
  username: String,
  avgRating: {
    type: Number,
    min: 1,
    max: 10
  },
  comments: [String],
  updatedTime: { type: Date, default: Date.now },
});

const List = mongoose.model('List', listSchema);

module.exports = List;
