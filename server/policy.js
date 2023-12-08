
const mongoose = require('./db'); 

const policySchema = new mongoose.Schema({
    content: String
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
