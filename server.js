const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'database.db');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize database
function initDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
                return;
            }
            console.log('Connected to SQLite database');
        });

        // Create tables
        db.serialize(() => {
            // Users/Accounts table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error creating users table:', err);
                    reject(err);
                }
            });

            // Students table
            db.run(`CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                people_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                degree TEXT NOT NULL,
                curriculum TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`, (err) => {
                if (err) {
                    console.error('Error creating students table:', err);
                    reject(err);
                }
            });

            // Courses table
            db.run(`CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                academic_year TEXT NOT NULL,
                academic_term TEXT NOT NULL,
                session TEXT NOT NULL,
                course_code TEXT NOT NULL,
                course_name TEXT NOT NULL,
                section TEXT NOT NULL,
                credits TEXT NOT NULL,
                quality_points TEXT NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students(id),
                UNIQUE(student_id, academic_year, academic_term, course_code)
            )`, (err) => {
                if (err) {
                    console.error('Error creating courses table:', err);
                    reject(err);
                }
            });

            // Final grades table
            db.run(`CREATE TABLE IF NOT EXISTS final_grades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                academic_year TEXT NOT NULL,
                academic_term TEXT NOT NULL,
                grade_type TEXT NOT NULL,
                score TEXT NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students(id),
                UNIQUE(student_id, academic_year, academic_term, grade_type)
            )`, (err) => {
                if (err) {
                    console.error('Error creating final_grades table:', err);
                    reject(err);
                } else {
                    // Seed initial data
                    seedInitialData(db).then(() => {
                        resolve(db);
                    }).catch(reject);
                }
            });
        });
    });
}

// Seed initial data
function seedInitialData(db) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Check if data already exists
            db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (row.count > 0) {
                    console.log('Database already has data, skipping seed');
                    resolve();
                    return;
                }

                // Insert first user account
                db.run(`INSERT INTO users (username, password) 
                        VALUES (?, ?)`,
                    ['youssef', 'password123'],
                    function(err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const userId1 = this.lastID;

                        // Insert first student
                        db.run(`INSERT INTO students (user_id, people_id, name, degree, curriculum) 
                                VALUES (?, ?, ?, ?, ?)`,
                            [userId1, '202300202', 'Youssef Aly', 'Medicine', 'Bachelor of Medicine and Surgery'],
                            function(err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                const studentId1 = this.lastID;

                                // Insert courses for user 1 - 2024/SEM1
                                const courses2024SEM1 = [
                                    ['01', 'VM 1.1 MDL', 'Vertical Module', '01', '3.000', '0.0000'],
                                    ['01', 'BS 1.1.3 MDL', 'Behavioural Sciences', '01', '5.000', '0.0000'],
                                    ['01', 'ID 1.1.2 MDL', 'Infection & Defense', '01', '9.000', '0.0000'],
                                    ['01', 'IM 1.1.1 MDL', 'Introductory Module', '01', '12.000', '0.0000']
                                ];

                                const stmt1 = db.prepare(`INSERT INTO courses 
                                    (student_id, academic_year, academic_term, session, course_code, course_name, section, credits, quality_points) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

                                courses2024SEM1.forEach(course => {
                                    stmt1.run(studentId1, '2024', 'SEM1', ...course);
                                });

                                stmt1.finalize((err) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }

                                    // Insert final grades for user 1 - 2024/SEM1
                                    db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                            VALUES (?, ?, ?, ?, ?)`, [studentId1, '2024', 'SEM1', 'SBA', '113.14']);
                                    db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                            VALUES (?, ?, ?, ?, ?)`, [studentId1, '2024', 'SEM1', 'OSPE', '136.50'], (err) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }

                                        // Insert second user account
                                        db.run(`INSERT INTO users (username, password) 
                                                VALUES (?, ?)`,
                                            ['ahmed', 'password456'],
                                            function(err) {
                                                if (err) {
                                                    reject(err);
                                                    return;
                                                }
                                                const userId2 = this.lastID;

                                                // Insert second student
                                                db.run(`INSERT INTO students (user_id, people_id, name, degree, curriculum) 
                                                        VALUES (?, ?, ?, ?, ?)`,
                                                    [userId2, '202300203', 'Ahmed Mohamed', 'Medicine', 'Bachelor of Medicine and Surgery'],
                                                    function(err) {
                                                        if (err) {
                                                            reject(err);
                                                            return;
                                                        }
                                                        const studentId2 = this.lastID;

                                                        // Insert courses for user 2 - 2024/SEM1
                                                        const courses2024SEM1_user2 = [
                                                            ['01', 'VM 1.1 MDL', 'Vertical Module', '01', '3.000', '0.0000'],
                                                            ['01', 'BS 1.1.3 MDL', 'Behavioural Sciences', '01', '5.000', '0.0000']
                                                        ];

                                                        const stmt2 = db.prepare(`INSERT INTO courses 
                                                            (student_id, academic_year, academic_term, session, course_code, course_name, section, credits, quality_points) 
                                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

                                                        courses2024SEM1_user2.forEach(course => {
                                                            stmt2.run(studentId2, '2024', 'SEM1', ...course);
                                                        });

                                                        stmt2.finalize((err) => {
                                                            if (err) {
                                                                reject(err);
                                                                return;
                                                            }

                                                            // Insert final grades for user 2 - 2024/SEM1
                                                            db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                    VALUES (?, ?, ?, ?, ?)`, [studentId2, '2024', 'SEM1', 'SBA', '105.50']);
                                                            db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                    VALUES (?, ?, ?, ?, ?)`, [studentId2, '2024', 'SEM1', 'OSPE', '128.75'], (err) => {
                                                                if (err) {
                                                                    reject(err);
                                                                    return;
                                                                }

                                                                // Insert third user account (Tarnim Ahmed)
                                                                db.run(`INSERT INTO users (username, password) 
                                                                        VALUES (?, ?)`,
                                                                    ['tarnim.ahmed.2023', 'Radwan23'],
                                                                    function(err) {
                                                                        if (err) {
                                                                            reject(err);
                                                                            return;
                                                                        }
                                                                        const userId3 = this.lastID;

                                                                        // Insert third student
                                                                        db.run(`INSERT INTO students (user_id, people_id, name, degree, curriculum) 
                                                                                VALUES (?, ?, ?, ?, ?)`,
                                                                            [userId3, '202300014', 'Tarnim Ahmed', 'Medicine', 'Bachelor of Medicine and Surgery'],
                                                                            function(err) {
                                                                                if (err) {
                                                                                    reject(err);
                                                                                    return;
                                                                                }
                                                                                const studentId3 = this.lastID;

                                                                                // Insert courses for user 3 - 2024/SEM1
                                                                                const courses2024SEM1_user3 = [
                                                                                    ['01', 'VM 1.1 MDL', 'Vertical Module', '01', '3.000', '0.0000'],
                                                                                    ['01', 'BS 1.1.3 MDL', 'Behavioural Sciences', '01', '5.000', '0.0000'],
                                                                                    ['01', 'ID 1.1.2 MDL', 'Infection & Defense', '01', '9.000', '0.0000'],
                                                                                    ['01', 'IM 1.1.1 MDL', 'Introductory Module', '01', '12.000', '0.0000']
                                                                                ];

                                                                                const stmt3_sem1 = db.prepare(`INSERT INTO courses 
                                                                                    (student_id, academic_year, academic_term, session, course_code, course_name, section, credits, quality_points) 
                                                                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

                                                                                courses2024SEM1_user3.forEach(course => {
                                                                                    stmt3_sem1.run(studentId3, '2024', 'SEM1', ...course);
                                                                                });

                                                                                stmt3_sem1.finalize((err) => {
                                                                                    if (err) {
                                                                                        reject(err);
                                                                                        return;
                                                                                    }

                                                                                    // Insert final grades for user 3 - 2024/SEM1
                                                                                    db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                            VALUES (?, ?, ?, ?, ?)`, [studentId3, '2024', 'SEM1', 'SBA', '102.86']);
                                                                                    db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                            VALUES (?, ?, ?, ?, ?)`, [studentId3, '2024', 'SEM1', 'OSPE', '138.60'], (err) => {
                                                                                        if (err) {
                                                                                            reject(err);
                                                                                            return;
                                                                                        }

                                                                                        // Insert courses for user 3 - 2024/SEM2
                                                                                        const courses2024SEM2_user3 = [
                                                                                            ['01', 'VM 1.2 MDL', 'Vertical Module', '01', '2.000', '0.0000'],
                                                                                            ['01', 'FNM 1.2.2 MDL', 'Fluids, Nutrition & Metabolism', '01', '12.000', '0.0000'],
                                                                                            ['01', 'CB 1.2.1 MDL', 'Circulation & Breathing', '01', '13.000', '0.0000']
                                                                                        ];

                                                                                        const stmt3_sem2 = db.prepare(`INSERT INTO courses 
                                                                                            (student_id, academic_year, academic_term, session, course_code, course_name, section, credits, quality_points) 
                                                                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

                                                                                        courses2024SEM2_user3.forEach(course => {
                                                                                            stmt3_sem2.run(studentId3, '2024', 'SEM2', ...course);
                                                                                        });

                                                                                        stmt3_sem2.finalize((err) => {
                                                                                            if (err) {
                                                                                                reject(err);
                                                                                                return;
                                                                                            }

                                                                                            // Insert final grades for user 3 - 2024/SEM2
                                                                                            db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                                    VALUES (?, ?, ?, ?, ?)`, [studentId3, '2024', 'SEM2', 'SBA', '192.62']);
                                                                                            db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                                    VALUES (?, ?, ?, ?, ?)`, [studentId3, '2024', 'SEM2', 'OSPE', '238.47']);
                                                                                            db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                                    VALUES (?, ?, ?, ?, ?)`, [studentId3, '2024', 'SEM2', 'SBA Total', '295.48']);
                                                                                            db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                                    VALUES (?, ?, ?, ?, ?)`, [studentId3, '2024', 'SEM2', 'OSPE Total', '377.07']);
                                                                                            db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                                    VALUES (?, ?, ?, ?, ?)`, [studentId3, '2024', 'SEM2', 'Total Percentage', '60.05']);
                                                                                            db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                                    VALUES (?, ?, ?, ?, ?)`, [studentId3, '2024', 'SEM2', 'Pass/Fail', 'Pass'], (err) => {
                                                                                                if (err) {
                                                                                                    reject(err);
                                                                                                    return;
                                                                                                }

                                                                                                // Insert courses for user 3 - 2025/SEM1
                                                                                                const courses2025SEM1_user3 = [
                                                                                                    ['01', 'VM 2.1 MDL', 'Vertical Module', '01', '2.000', '0.0000'],
                                                                                                    ['01', 'ESR 2.1.2 MDL', 'Endocrine System & Reproduction', '01', '12.000', '0.0000'],
                                                                                                    ['01', 'MMB. 2.1.1 MDL', 'Movement & Musculoskeletal Biology', '01', '12.000', '0.0000']
                                                                                                ];

                                                                                                const stmt3_2025_sem1 = db.prepare(`INSERT INTO courses 
                                                                                                    (student_id, academic_year, academic_term, session, course_code, course_name, section, credits, quality_points) 
                                                                                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

                                                                                                courses2025SEM1_user3.forEach(course => {
                                                                                                    stmt3_2025_sem1.run(studentId3, '2025', 'SEM1', ...course);
                                                                                                });

                                                                                                stmt3_2025_sem1.finalize((err) => {
                                                                                                    if (err) {
                                                                                                        reject(err);
                                                                                                        return;
                                                                                                    }

                                                                                                    // Insert final grades for user 3 - 2025/SEM1
                                                                                                    db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                                            VALUES (?, ?, ?, ?, ?)`, [studentId3, '2025', 'SEM1', 'SBA', '114.32']);
                                                                                                    db.run(`INSERT INTO final_grades (student_id, academic_year, academic_term, grade_type, score) 
                                                                                                            VALUES (?, ?, ?, ?, ?)`, [studentId3, '2025', 'SEM1', 'OSPE', '136.54'], (err) => {
                                                                                                        if (err) {
                                                                                                            reject(err);
                                                                                                        } else {
                                                                                                            console.log('Initial data seeded successfully with 3 accounts');
                                                                                                            resolve();
                                                                                                        }
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                            });
                                                                    });
                                                            });
                                                        });
                                                    });
                                            });
                                    });
                                });
                            });
                    });
            });
        });
    });
}

// API Routes

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = new sqlite3.Database(DB_PATH);

    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, 
        [username, password], (err, user) => {
            db.close();
            
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Get student info for this user
            const db2 = new sqlite3.Database(DB_PATH);
            db2.get(`SELECT * FROM students WHERE user_id = ?`, [user.id], (err, student) => {
                db2.close();
                
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    success: true,
                    username: user.username,
                    userId: user.id,
                    studentId: student ? student.id : null,
                    studentInfo: student ? {
                        name: student.name,
                        degree: student.degree,
                        curriculum: student.curriculum,
                        peopleId: student.people_id
                    } : null
                });
            });
        });
});

// Get grade report data
app.get('/api/grade-report', (req, res) => {
    const { academicYear, academicTerm, userId } = req.query;

    if (!academicYear || !academicTerm) {
        return res.status(400).json({ error: 'academicYear and academicTerm are required' });
    }

    if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
    }

    const db = new sqlite3.Database(DB_PATH);

    // Get student for this user
    db.get(`SELECT * FROM students WHERE user_id = ?`, [userId], (err, student) => {
        if (err) {
            db.close();
            return res.status(500).json({ error: err.message });
        }

        if (!student) {
            db.close();
            return res.status(404).json({ error: 'Student not found' });
        }

        // Get courses
        db.all(`SELECT * FROM courses 
                WHERE student_id = ? AND academic_year = ? AND academic_term = ?`,
            [student.id, academicYear, academicTerm], (err, courses) => {
                if (err) {
                    db.close();
                    return res.status(500).json({ error: err.message });
                }

                // Get final grades
                db.all(`SELECT * FROM final_grades 
                        WHERE student_id = ? AND academic_year = ? AND academic_term = ?`,
                    [student.id, academicYear, academicTerm], (err, finalGrades) => {
                        db.close();

                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        // Format response
                        const finalGradesObj = {};
                        finalGrades.forEach(fg => {
                            finalGradesObj[fg.grade_type] = fg.score;
                        });

                        res.json({
                            studentInfo: {
                                name: student.name,
                                degree: student.degree,
                                curriculum: student.curriculum,
                                peopleId: student.people_id
                            },
                            courses: courses.map(c => ({
                                session: c.session,
                                course: c.course_code,
                                name: c.course_name,
                                section: c.section,
                                credits: c.credits,
                                qualityPoints: c.quality_points
                            })),
                            finalGrades: finalGradesObj
                        });
                    });
            });
    });
});

// Add/Update course
app.post('/api/courses', (req, res) => {
    const { academicYear, academicTerm, session, courseCode, courseName, section, credits, qualityPoints, userId } = req.body;

    if (!academicYear || !academicTerm || !courseCode) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
    }

    const db = new sqlite3.Database(DB_PATH);

    db.get(`SELECT id FROM students WHERE user_id = ?`, [userId], (err, student) => {
        if (err || !student) {
            db.close();
            return res.status(404).json({ error: 'Student not found' });
        }

        db.run(`INSERT OR REPLACE INTO courses 
                (student_id, academic_year, academic_term, session, course_code, course_name, section, credits, quality_points) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [student.id, academicYear, academicTerm, session || '01', courseCode, courseName || '', section || '01', credits || '0.000', qualityPoints || '0.0000'],
            function(err) {
                db.close();
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: this.lastID, message: 'Course saved successfully' });
            });
    });
});

// Add/Update final grade
app.post('/api/final-grades', (req, res) => {
    const { academicYear, academicTerm, gradeType, score, userId } = req.body;

    if (!academicYear || !academicTerm || !gradeType || !score) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    if (!userId) {
        return res.status(401).json({ error: 'User authentication required' });
    }

    const db = new sqlite3.Database(DB_PATH);

    db.get(`SELECT id FROM students WHERE user_id = ?`, [userId], (err, student) => {
        if (err || !student) {
            db.close();
            return res.status(404).json({ error: 'Student not found' });
        }

        db.run(`INSERT OR REPLACE INTO final_grades 
                (student_id, academic_year, academic_term, grade_type, score) 
                VALUES (?, ?, ?, ?, ?)`,
            [student.id, academicYear, academicTerm, gradeType, score],
            function(err) {
                db.close();
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: this.lastID, message: 'Final grade saved successfully' });
            });
    });
});

// Get all available years and terms
app.get('/api/years-terms', (req, res) => {
    const db = new sqlite3.Database(DB_PATH);

    db.all(`SELECT DISTINCT academic_year, academic_term 
            FROM courses 
            ORDER BY academic_year DESC, academic_term`,
        [], (err, rows) => {
            db.close();
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
});

// Start server
initDatabase().then((db) => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
