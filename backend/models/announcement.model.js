const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    title: { type: String, required: true},
    date: { type: Date, required: true },
    message: { type: String, required: true },
    sender: { type: String, required: true },

}, {
    timestamps: true,
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;