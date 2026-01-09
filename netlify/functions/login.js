// Netlify serverless function for login
const { users } = require('./data.js');

exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { username, password } = JSON.parse(event.body || '{}');

        if (!username || !password) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Username and password are required' })
            };
        }

        const user = users[username];

        if (!user || user.password !== password) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid username or password' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
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
