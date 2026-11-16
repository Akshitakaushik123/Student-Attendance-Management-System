
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    roll: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
