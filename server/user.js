// user.js
const mongoose = require('./db'); // Import your MongoDB connection

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    verified: Boolean,
    active: Boolean,
    admin: Boolean
});

const User = mongoose.model('User', userSchema);

module.exports = User;
