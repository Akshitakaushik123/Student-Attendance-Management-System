
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');
const Attendance = require('./models/Attendance');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Home Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Add Student
app.post('/students', async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            message: 'Student added successfully',
            data: student
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// View Students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark Attendance
app.post('/attendance', async (req, res) => {
    try {
        const student = await Student.findOne({
            roll: req.body.roll
        });

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        const record = await Attendance.create({
            roll: req.body.roll,
            subject: req.body.subject || 'General',
            status: req.body.status,
            date: req.body.date || Date.now()
        });

        res.status(201).json({
            message: 'Attendance marked successfully',
            data: record
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// View Attendance Records
app.get('/attendance', async (req, res) => {
    try {
        const records = await Attendance.find();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// View Student Attendance Percentage
app.get('/attendance/percentage/:roll', async (req, res) => {
    try {
        const records = await Attendance.find({
            roll: req.params.roll
        });

        const total = records.length;
        const present = records.filter(
            record => record.status === 'Present'
        ).length;

        const percentage = total === 0
            ? 0
            : (present / total) * 100;

        res.json({
            roll: req.params.roll,
            totalClasses: total,
            presentClasses: present,
            attendancePercentage: percentage.toFixed(2) + '%'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
