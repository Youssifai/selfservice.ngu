// Netlify serverless function for grade report
const { users, gradeData } = require('./data.js');

exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { academicYear, academicTerm, userId } = event.queryStringParameters || {};

        if (!academicYear || !academicTerm) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'academicYear and academicTerm are required' })
            };
        }

        if (!userId) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'User authentication required' })
            };
        }

        const studentId = parseInt(userId);
        const userData = gradeData[studentId];

        if (!userData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Student data not found' })
            };
        }

        const yearData = userData[academicYear];
        if (!yearData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Academic year not found' })
            };
        }

        const termData = yearData[academicTerm];
        if (!termData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Academic term not found' })
            };
        }

        // Find user to get student info
        const user = Object.values(users).find(u => u.id === studentId);
        if (!user) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Student not found' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                studentInfo: {
                    name: user.student.name,
                    degree: user.student.degree,
                    curriculum: user.student.curriculum,
                    peopleId: user.student.peopleId
                },
                courses: termData.courses,
                finalGrades: termData.finalGrades
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Internal server error' })
        };
    }
};
