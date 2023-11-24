// db.js
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ibeaudr:301238@se3316.d5qdvm4.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
