// user.js
const mongoose = require('./db'); 

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    verified: Boolean,
    active: Boolean,
    admin: Boolean,
    lessAdmin: Boolean,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
