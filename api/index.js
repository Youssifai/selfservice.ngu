const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Hardcoded user data
const users = {
    'youssef.aly.2023': {
        id: 1,
        username: 'youssef.aly.2023',
        password: 'Sophy2005',
        student: {
            id: 1,
            name: 'Youssef Aly',
            degree: 'Medicine',
            curriculum: 'Bachelor of Medicine and Surgery',
            peopleId: '202300202'
        }
    },
    'tarnim.ahmed.2023': {
        id: 2,
        username: 'tarnim.ahmed.2023',
        password: 'Radwan23',
        student: {
            id: 2,
            name: 'Tarnim Ahmed',
            degree: 'Medicine',
            curriculum: 'Bachelor of Medicine and Surgery',
            peopleId: '202300014'
        }
    }
};

// Hardcoded grade data
const gradeData = {
    1: { // Youssef Aly
        '2024': {
            'SEM1': {
                courses: [
                    { session: '01', course: 'VM 1.1 MDL', name: 'Vertical Module', section: '01', credits: '3.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'BS 1.1.3 MDL', name: 'Behavioural Sciences', section: '01', credits: '5.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'ID 1.1.2 MDL', name: 'Infection & Defense', section: '01', credits: '9.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'IM 1.1.1 MDL', name: 'Introductory Module', section: '01', credits: '12.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '113.14',
                    'OSPE': '136.50'
                }
            },
            'SEM2': {
                courses: [
                    { session: '01', course: 'VM 1.2 MDL', name: 'Vertical Module', section: '01', credits: '2.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'FNM 1.2.2 MDL', name: 'Fluids, Nutrition & Metabolism', section: '01', credits: '12.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'CB 1.2.1 MDL', name: 'Circulation & Breathing', section: '01', credits: '13.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '213.89',
                    'OSPE': '236.83',
                    'SBA Total': '327.03',
                    'OSPE Total': '373.33',
                    'Total Percentage': '62.53',
                    'Pass/Fail': 'Pass'
                }
            }
        },
        '2025': {
            'SEM1': {
                courses: [
                    { session: '01', course: 'VM 2.1 MDL', name: 'Vertical Module', section: '01', credits: '2.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'ESR 2.1.2 MDL', name: 'Endocrine System & Reproduction', section: '01', credits: '12.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'MMB. 2.1.1 MDL', name: 'Movement & Musculoskeletal Biology', section: '01', credits: '12.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '112',
                    'OSPE': '128'
                }
            }
        }
    },
    2: { // Tarnim Ahmed
        '2024': {
            'SEM1': {
                courses: [
                    { session: '01', course: 'VM 1.1 MDL', name: 'Vertical Module', section: '01', credits: '3.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'BS 1.1.3 MDL', name: 'Behavioural Sciences', section: '01', credits: '5.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'ID 1.1.2 MDL', name: 'Infection & Defense', section: '01', credits: '9.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'IM 1.1.1 MDL', name: 'Introductory Module', section: '01', credits: '12.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '102.86',
                    'OSPE': '138.60'
                }
            },
            'SEM2': {
                courses: [
                    { session: '01', course: 'VM 1.2 MDL', name: 'Vertical Module', section: '01', credits: '2.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'FNM 1.2.2 MDL', name: 'Fluids, Nutrition & Metabolism', section: '01', credits: '12.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'CB 1.2.1 MDL', name: 'Circulation & Breathing', section: '01', credits: '13.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '192.62',
                    'OSPE': '238.47',
                    'SBA Total': '295.48',
                    'OSPE Total': '377.07',
                    'Total Percentage': '60.05',
                    'Pass/Fail': 'Pass'
                }
            }
        },
        '2025': {
            'SEM1': {
                courses: [
                    { session: '01', course: 'VM 2.1 MDL', name: 'Vertical Module', section: '01', credits: '2.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'ESR 2.1.2 MDL', name: 'Endocrine System & Reproduction', section: '01', credits: '12.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'MMB. 2.1.1 MDL', name: 'Movement & Musculoskeletal Biology', section: '01', credits: '12.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '114',
                    'OSPE': '128'
                }
            }
        }
    }
};

// Get available years and terms for a student
function getAvailableYearsTerms(studentId) {
    const data = gradeData[studentId];
    if (!data) return [];
    
    const yearsTerms = [];
    for (const year in data) {
        for (const term in data[year]) {
            yearsTerms.push({ academic_year: year, academic_term: term });
        }
    }
    return yearsTerms.sort((a, b) => {
        if (a.academic_year !== b.academic_year) {
            return b.academic_year.localeCompare(a.academic_year);
        }
        return b.academic_term.localeCompare(a.academic_term);
    });
}

// Login endpoint
app.post('/login', (req, res) => {
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
});

// Get grade report data
app.get('/grade-report', (req, res) => {
    const { academicYear, academicTerm, userId } = req.query;

    if (!academicYear || !academicTerm) {
        return res.status(400).json({ error: 'academicYear and academicTerm are required' });
    }

    if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
    }

    const user = Object.values(users).find(u => u.id === parseInt(userId));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const studentData = gradeData[user.student.id];
    if (!studentData || !studentData[academicYear] || !studentData[academicYear][academicTerm]) {
        return res.status(404).json({ error: 'Grade data not found' });
    }

    const termData = studentData[academicYear][academicTerm];

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
});

// Add/Update course (stub - data is read-only)
app.post('/courses', (req, res) => {
    res.json({ message: 'Data is read-only in this deployment' });
});

// Add/Update final grade (stub - data is read-only)
app.post('/final-grades', (req, res) => {
    res.json({ message: 'Data is read-only in this deployment' });
});

// Get all available years and terms
app.get('/years-terms', (req, res) => {
    const { userId } = req.query;
    
    if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
    }

    const user = Object.values(users).find(u => u.id === parseInt(userId));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const yearsTerms = getAvailableYearsTerms(user.student.id);
    res.json(yearsTerms);
});

// Export for Vercel
module.exports = app;
