
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const Student = require('./models/Student');
const Attendance = require('./models/Attendance');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// =====================================
// 1. HOME ROUTE
// =====================================

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// =====================================
// 2. ADD STUDENT
// =====================================

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

// =====================================
// 3. VIEW ALL STUDENTS
// =====================================

app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================================
// 4. UPDATE STUDENT
// =====================================

app.put('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json({
            message: 'Student updated successfully',
            data: student
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// =====================================
// 5. MARK ATTENDANCE
// =====================================

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

        const log = `Roll: ${record.roll}, Subject: ${record.subject}, Status: ${record.status}, Date: ${record.date}\n`;

        fs.appendFile('attendance.txt', log, (error) => {
            if (error) {
                console.log('File logging error:', error);
            } else {
                console.log('Attendance log saved successfully');
            }
        });

        res.status(201).json({
            message: 'Attendance marked successfully',
            data: record
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// =====================================
// 6. VIEW ATTENDANCE RECORDS
// =====================================

app.get('/attendance', async (req, res) => {
    try {
        const records = await Attendance.find();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================================
// 7. UPDATE ATTENDANCE
// =====================================

app.put('/attendance/:roll/:subject/:date', async (req, res) => {
    try {
        const { roll, subject, date } = req.params;

        const startDate = new Date(`${date}T00:00:00.000Z`);
        const endDate = new Date(`${date}T23:59:59.999Z`);

        if (isNaN(startDate.getTime())) {
            return res.status(400).json({
                message: 'Invalid date format'
            });
        }

        const record = await Attendance.findOneAndUpdate(
            {
                roll: roll,
                subject: subject,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            },
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!record) {
            return res.status(404).json({
                message: 'Attendance record not found for this roll number, subject and date'
            });
        }

        res.json({
            message: 'Attendance updated successfully',
            data: record
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// =====================================
// 8. CALCULATE ATTENDANCE PERCENTAGE
// =====================================

app.get('/attendance/percentage/:roll', async (req, res) => {
    try {
        const roll = req.params.roll;

        const total = await Attendance.countDocuments({ roll });
        const present = await Attendance.countDocuments({
            roll,
            status: 'Present'
        });

        if (total === 0) {
            return res.json({
                roll,
                message: 'No attendance records found',
                percentage: '0%'
            });
        }

        const percentage = (present / total) * 100;

        res.json({
            roll,
            totalClasses: total,
            presentClasses: present,
            absentClasses: total - present,
            attendancePercentage: percentage.toFixed(2) + '%'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================================
// 9. CONNECT DATABASE AND START SERVER
// =====================================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.log('MongoDB connection error:', error.message);
    });
