const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registrationSchema = new Schema({
    date: { type: Date },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    user: { type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true,
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;