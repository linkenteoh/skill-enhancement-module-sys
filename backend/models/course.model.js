const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseTitle:{ type: String, required:true},
    courseOverview:{ type: String, required:true},
    courseObjectives:{ type: Array, required:true},
    startDate:{ type: Date, required:true },
    endDate:{ type: Date, required:true },
    published:{ type: Boolean, required:true },
    completed:{ type: Boolean },
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;