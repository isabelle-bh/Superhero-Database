
const mongoose = require('./db'); 

const aupSchema = new mongoose.Schema({
    content: String
});

const AUP = mongoose.model('AUP', aupSchema);

module.exports = AUP;
