const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classSchema = new Schema({
    title: { type: String },
    venue: { type: String },
    date: { type: Date },
    lecturer: { type: String},
    startTime: { type: String },
    endTime: { type: String },
    link: { type: String },
    course: { type: Schema.Types.ObjectId, ref: 'Course' }

}, {
    timestamps: true,
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;