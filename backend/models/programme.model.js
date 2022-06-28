const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const programmeSchema = new Schema({
    programme: { type: String, required: true }
});

const Programme = mongoose.model('Programme', programmeSchema);

module.exports = Programme;