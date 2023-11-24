// list.js
const mongoose = require('./db'); // Import your MongoDB connection

const listSchema = new mongoose.Schema({
  name: String,
  superheroes: [String], // Change the data type as needed
});

const List = mongoose.model('List', listSchema);

module.exports = List;
