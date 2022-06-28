const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resultSchema = new Schema({
    score: { type: Number },
    status: { type: Boolean },
    course: { type: Schema.Types.ObjectId, ref: 'Course'},
    registration: { type: Schema.Types.ObjectId, ref: 'Registration'},
    paper: { type: Schema.Types.ObjectId, ref: 'Paper'},
    user: { type: Schema.Types.ObjectId, ref: 'User'},
}, {
    timestamps: true,
});

const Registration = mongoose.model('Result', resultSchema);

module.exports = Registration;