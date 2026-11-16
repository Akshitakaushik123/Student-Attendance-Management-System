
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll: {
        type: String,
        required: true,
        unique: true
    },
    course: {
        type: String,
        default: 'B.Voc Software Development'
    },
    semester: {
        type: Number,
        default: 3
    }
});

module.exports = mongoose.model('Student', studentSchema);
