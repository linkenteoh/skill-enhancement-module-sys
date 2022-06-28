const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paperSchema = new Schema({
    paperName:{ type: String, required:true},
    paperSchedule: {type: Date},
    venue: {type: String},
    venueLink: {type: String},
    paperTime:{type: String},
    threshold: {type: Number},
    course: { type: Schema.Types.ObjectId, ref: 'Course' }
}, {
    timestamps: true,
});

const Paper = mongoose.model('Paper', paperSchema);

module.exports = Paper;