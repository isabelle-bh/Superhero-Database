// list.js
const mongoose = require('./db'); // Import your MongoDB connection

const listSchema = new mongoose.Schema({
  name: String,
  superheroes: [String], // Change the data type as needed
  user: { type: String, required: true }, // Change the type to String
  desc: String,
  visibility: String,
  username: String,
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  comments: [String],
});

const List = mongoose.model('List', listSchema);

module.exports = List;
