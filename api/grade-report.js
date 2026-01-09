// Import shared data
const { users, gradeData } = require('./data.js');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { academicYear, academicTerm, userId } = req.query;

    if (!academicYear || !academicTerm) {
        return res.status(400).json({ error: 'academicYear and academicTerm are required' });
    }

    if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
    }

    const studentId = parseInt(userId);
    const userData = gradeData[studentId];

    if (!userData) {
        return res.status(404).json({ error: 'Student data not found' });
    }

    const yearData = userData[academicYear];
    if (!yearData) {
        return res.status(404).json({ error: 'Academic year not found' });
    }

    const termData = yearData[academicTerm];
    if (!termData) {
        return res.status(404).json({ error: 'Academic term not found' });
    }

    // Find user to get student info
    const user = Object.values(users).find(u => u.id === studentId);
    if (!user) {
        return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
        studentInfo: {
            name: user.student.name,
            degree: user.student.degree,
            curriculum: user.student.curriculum,
            peopleId: user.student.peopleId
        },
        courses: termData.courses,
        finalGrades: termData.finalGrades
    });
};
