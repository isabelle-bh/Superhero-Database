
const mongoose = require('./db'); 

const dmcaSchema = new mongoose.Schema({
    content: String
});

const DMCA = mongoose.model('DMCA', dmcaSchema);

module.exports = DMCA;
