const express = require('express');
const app = express();
app.use(express.json());
let students = [];
let attendance = [];
// Add Student
app.post('/students', (req, res) => {
    students.push(req.body);

    res.json({
        message: 'Student added successfully',
        data: students
    });
});
// View Students
app.get('/students', (req, res) => {
    res.json(students);
});

// Mark Attendance
app.post('/attendance', (req, res) => {
    attendance.push(req.body);

    res.json({
        message: 'Attendance marked successfully',
        data: attendance
    });
});

// View Attendance
app.get('/attendance', (req, res) => {
    res.json(attendance);
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
