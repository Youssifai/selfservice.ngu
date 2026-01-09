// Import shared data
const { users } = require('./data.js');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users[username];

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({
        success: true,
        username: user.username,
        userId: user.id,
        studentId: user.student.id,
        studentInfo: {
            name: user.student.name,
            degree: user.student.degree,
            curriculum: user.student.curriculum,
            peopleId: user.student.peopleId
        }
    });
};
