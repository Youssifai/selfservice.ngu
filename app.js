// API Configuration - works for both local development and Vercel deployment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Application State
const state = {
    currentPage: 'signin',
    username: '',
    userId: null,
    studentId: null,
    studentInfo: null,
    currentYear: '2024',
    currentTerm: 'SEM1',
    currentDate: new Date(2026, 0, 8), // January 8, 2026 to match screenshot
    showReport: false
};

// Data Structure
const courseData = {
    "2024": {
        "SEM1": {
            courses: [
                { session: "01", course: "VM 1.1 MDL", name: "Vertical Module", section: "01", credits: "3.000", qualityPoints: "0.0000" },
                { session: "01", course: "BS 1.1.3 MDL", name: "Behavioural Sciences", section: "01", credits: "5.000", qualityPoints: "0.0000" },
                { session: "01", course: "ID 1.1.2 MDL", name: "Infection & Defense", section: "01", credits: "9.000", qualityPoints: "0.0000" },
                { session: "01", course: "IM 1.1.1 MDL", name: "Introductory Module", section: "01", credits: "12.000", qualityPoints: "0.0000" }
            ],
            finalGrades: {
                SBA: "113.14",
                OSPE: "136.50"
            },
            studentInfo: {
                name: "Youssef Aly",
                degree: "Medicine",
                curriculum: "Bachelor of Medicine and Surgery",
                peopleId: "202300202"
            }
        },
        "SEM2": {
            courses: [
                { session: "01", course: "VM 1.2 MDL", name: "Vertical Module 2", section: "01", credits: "3.000", qualityPoints: "0.0000" },
                { session: "01", course: "BS 1.2.3 MDL", name: "Behavioural Sciences 2", section: "01", credits: "5.000", qualityPoints: "0.0000" }
            ],
            finalGrades: {
                SBA: "120.00",
                OSPE: "140.00"
            },
            studentInfo: {
                name: "Youssef Aly",
                degree: "Medicine",
                curriculum: "Bachelor of Medicine and Surgery",
                peopleId: "202300202"
            }
        }
    },
    "2023": {
        "SEM1": {
            courses: [
                { session: "01", course: "VM 1.0 MDL", name: "Vertical Module", section: "01", credits: "3.000", qualityPoints: "0.0000" }
            ],
            finalGrades: {
                SBA: "100.00",
                OSPE: "120.00"
            },
            studentInfo: {
                name: "Youssef Aly",
                degree: "Medicine",
                curriculum: "Bachelor of Medicine and Surgery",
                peopleId: "202300202"
            }
        },
        "SEM2": {
            courses: [
                { session: "01", course: "VM 1.1 MDL", name: "Vertical Module", section: "01", credits: "3.000", qualityPoints: "0.0000" }
            ],
            finalGrades: {
                SBA: "105.00",
                OSPE: "125.00"
            },
            studentInfo: {
                name: "Youssef Aly",
                degree: "Medicine",
                curriculum: "Bachelor of Medicine and Surgery",
                peopleId: "202300202"
            }
        }
    },
    "2025": {
        "SEM1": {
            courses: [
                { session: "01", course: "VM 1.3 MDL", name: "Vertical Module", section: "01", credits: "3.000", qualityPoints: "0.0000" },
                { session: "01", course: "BS 1.3.3 MDL", name: "Behavioural Sciences", section: "01", credits: "5.000", qualityPoints: "0.0000" }
            ],
            finalGrades: {
                SBA: "125.00",
                OSPE: "145.00"
            },
            studentInfo: {
                name: "Youssef Aly",
                degree: "Medicine",
                curriculum: "Bachelor of Medicine and Surgery",
                peopleId: "202300202"
            }
        },
        "SEM2": {
            courses: [
                { session: "01", course: "VM 1.4 MDL", name: "Vertical Module", section: "01", credits: "3.000", qualityPoints: "0.0000" }
            ],
            finalGrades: {
                SBA: "130.00",
                OSPE: "150.00"
            },
            studentInfo: {
                name: "Youssef Aly",
                degree: "Medicine",
                curriculum: "Bachelor of Medicine and Surgery",
                peopleId: "202300202"
            }
        }
    }
};

// API Functions
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

async function fetchGradeReport(academicYear, academicTerm) {
    if (!state.userId) {
        console.error('User not authenticated');
        return null;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/grade-report?academicYear=${academicYear}&academicTerm=${academicTerm}&userId=${state.userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch grade report');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching grade report:', error);
        return null;
    }
}

// Router
function navigateTo(page) {
    state.currentPage = page;
    render();
}

// Render Functions
function render() {
    const app = document.getElementById('app');
    
    switch(state.currentPage) {
        case 'signin':
            app.className = '';
            document.body.classList.remove('filter-page-active');
            app.innerHTML = renderSignInPage();
            attachSignInHandlers();
            break;
        case 'welcome':
            app.className = '';
            document.body.classList.remove('filter-page-active');
            app.innerHTML = renderWelcomePage();
            attachWelcomeHandlers();
            break;
        case 'dashboard':
            app.className = '';
            document.body.classList.remove('filter-page-active');
            app.innerHTML = renderDashboard();
            attachDashboardHandlers();
            break;
        case 'transcript-filter':
            app.className = 'filter-page';
            document.body.classList.add('filter-page-active');
            renderTranscriptFilter().then(html => {
                app.innerHTML = html;
                attachFilterHandlers();
                // Scroll to report if it's shown
                if (state.showReport) {
                    setTimeout(() => {
                        const reportSection = document.querySelector('.report-section');
                        if (reportSection) {
                            reportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 100);
                }
            });
            break;
        case 'transcript-report':
            app.className = '';
            document.body.classList.remove('filter-page-active');
            app.innerHTML = renderTranscriptReport();
            attachReportHandlers();
            break;
    }
}

function renderSignInPage() {
    return `
        <div class="header">
            <div class="header-left">
                <span class="header-logo">ellucian.</span>
            </div>
            <div class="header-right">
                <div class="header-menu-icon">☰</div>
            </div>
        </div>
        <div class="signin-container">
            <div class="signin-card">
                <h1 class="signin-title">Sign in</h1>
                <form class="signin-form" id="signin-form">
                    <div class="form-group">
                        <input 
                            type="text" 
                            class="form-input" 
                            id="username-input" 
                            placeholder="User Name"
                            autocomplete="username"
                        >
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary">Next</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="footer">
            PowerCampus® Self-service 9.1.1 - Copyright 1995-2020 Ellucian Company L.P. and its affiliates.
        </div>
    `;
}

function renderWelcomePage() {
    return `
        <div class="header">
            <div class="header-left">
                <span class="header-logo">ellucian.</span>
            </div>
            <div class="header-right">
                <div class="header-menu-icon">☰</div>
            </div>
        </div>
        <div class="signin-container">
            <div class="signin-card">
                <h1 class="signin-title">Welcome</h1>
                <div class="welcome-subtitle">${state.username}</div>
                <a href="#" class="welcome-link" id="use-another-account">Use another account</a>
                <form class="signin-form" id="password-form">
                    <div class="form-group vertical">
                        <div class="password-group">
                            <input 
                                type="password" 
                                class="form-input" 
                                id="password-input" 
                                placeholder="Password"
                                autocomplete="current-password"
                            >
                            <span class="password-show" id="show-password">Show</span>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Sign in</button>
                </form>
            </div>
        </div>
        <div class="footer">
            PowerCampus® Self-service 9.1.1 - Copyright 1995-2020 Ellucian Company L.P. and its affiliates.
        </div>
    `;
}

function renderDashboard() {
    const currentDate = state.currentDate;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = currentDate.getDate();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const currentDayName = dayNames[currentDate.getDay()];
    const currentMonthName = monthNames[month];
    
    let calendarDays = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        calendarDays.push({
            day: prevMonthLastDay - i,
            isOtherMonth: true
        });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({
            day: i,
            isOtherMonth: false,
            isToday: i === today && month === new Date().getMonth() && year === new Date().getFullYear()
        });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({
            day: i,
            isOtherMonth: true
        });
    }
    
    const calendarHTML = calendarDays.map(day => {
        const classes = ['calendar-day'];
        if (day.isOtherMonth) classes.push('other-month');
        if (day.isToday) classes.push('today');
        return `<div class="${classes.join(' ')}">${day.day}</div>`;
    }).join('');
    
    return `
        <div class="header">
            <div class="header-left">
                <span class="header-logo">ellucian.</span>
                <nav class="header-nav">
                    <a href="#">REGISTRATION</a>
                    <div class="dropdown">
                        <a href="#">GRADES</a>
                        <div class="dropdown-menu">
                            <a href="#" data-action="grade-report">GRADE REPORT (HEALTH)</a>
                            <a href="#" data-action="transcript" target="_blank">UNOFFICIAL TRANSCRIPT (HEALTH)</a>
                        </div>
                    </div>
                    <a href="#">SEARCH</a>
                </nav>
            </div>
            <div class="header-right">
                <div class="header-user">🛒</div>
                <div class="header-user">👤 ${state.username}</div>
                <div class="header-menu-icon">☰</div>
            </div>
        </div>
        <div class="dashboard-container">
            <h1 class="dashboard-title">Today's Overview</h1>
            <div class="dashboard-grid">
                <div class="dashboard-card calendar-card">
                    <h2 class="calendar-title">Your Calendar</h2>
                    <div class="calendar-header">
                        <button class="calendar-nav" id="prev-month">‹</button>
                        <div class="calendar-month">${currentMonthName} ${year}</div>
                        <button class="calendar-nav" id="next-month">›</button>
                    </div>
                    <div class="calendar-weekdays">
                        <div class="calendar-weekday">SU</div>
                        <div class="calendar-weekday">MO</div>
                        <div class="calendar-weekday">TU</div>
                        <div class="calendar-weekday">WE</div>
                        <div class="calendar-weekday">TH</div>
                        <div class="calendar-weekday">FR</div>
                        <div class="calendar-weekday">SA</div>
                    </div>
                    <div class="calendar-days">
                        ${calendarHTML}
                    </div>
                    <div class="calendar-date-display">${currentDayName}, ${currentMonthName} ${today}, ${year}</div>
                </div>
                <div class="dashboard-card empty-card">
                </div>
            </div>
        </div>
        <div class="footer">
            PowerCampus® Self-service 9.1.1 - Copyright 1995-2020 Ellucian Company L.P. and its affiliates.
        </div>
    `;
}

async function renderTranscriptFilter() {
    const years = [];
    for (let i = 2016; i <= 2025; i++) {
        years.push(i);
    }
    
    const yearOptions = years.map(year => 
        `<option value="${year}" ${year == state.currentYear ? 'selected' : ''}>${year}</option>`
    ).join('');
    
    let data = null;
    if (state.showReport) {
        data = await fetchGradeReport(state.currentYear, state.currentTerm);
    }
    
    let reportHTML = '';
    
    if (data && state.showReport) {
        const coursesHTML = data.courses.map(course => `
            <tr>
                <td>${course.session}</td>
                <td>${course.course}</td>
                <td>${course.name}</td>
                <td>${course.section}</td>
                <td>${course.credits}</td>
                <td>${course.qualityPoints}</td>
            </tr>
        `).join('');
        
        reportHTML = `
            <div class="report-section">
                <div class="pagination-bar">
                    <button class="pagination-btn" type="button">«</button>
                    <button class="pagination-btn" type="button">‹</button>
                    <input type="text" class="pagination-input" value="1" size="3">
                    <span class="pagination-text">of 1</span>
                    <button class="pagination-btn" type="button">›</button>
                    <button class="pagination-btn" type="button">»</button>
                    <input type="text" class="pagination-input" value="" size="10">
                    <span class="pagination-text">Find | Next</span>
                    <select class="pagination-select">
                        <option></option>
                    </select>
                    <button class="pagination-refresh" type="button" title="Refresh">↻</button>
                </div>
                
                <h1 class="report-title">Grade Report – ${state.currentYear}/${state.currentTerm}</h1>
                
                <div class="report-header">
                    <div class="report-info">
                        <span class="report-info-item">
                            <span class="report-info-label">Student Name:</span>
                            <span class="report-info-value">${data.studentInfo.name}</span>
                        </span>
                        <span class="report-info-item">
                            <span class="report-info-label">Degree:</span>
                            <span class="report-info-value">${data.studentInfo.degree}</span>
                        </span>
                        <span class="report-info-item">
                            <span class="report-info-label">Curriculum:</span>
                            <span class="report-info-value">${data.studentInfo.curriculum}</span>
                        </span>
                        <span class="report-info-item">
                            <span class="report-info-label">PeopleId:</span>
                            <span class="report-info-value">${data.studentInfo.peopleId}</span>
                        </span>
                    </div>
                </div>
                
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Session</th>
                            <th>Course</th>
                            <th>Name</th>
                            <th>Section</th>
                            <th>Credits</th>
                            <th>Quality Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${coursesHTML}
                    </tbody>
                </table>
                
                <div class="final-grades">
                    <h3 class="final-grades-title">Final Grades</h3>
                    <table class="final-grades-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.finalGrades.SBA ? `<tr><td>SBA</td><td>${data.finalGrades.SBA}</td></tr>` : ''}
                            ${data.finalGrades.OSPE ? `<tr><td>OSPE</td><td>${data.finalGrades.OSPE}</td></tr>` : ''}
                            ${data.finalGrades['SBA Total'] ? `<tr><td>SBA Total</td><td>${data.finalGrades['SBA Total']}</td></tr>` : ''}
                            ${data.finalGrades['OSPE Total'] ? `<tr><td>OSPE Total</td><td>${data.finalGrades['OSPE Total']}</td></tr>` : ''}
                            ${data.finalGrades['Total Percentage'] ? `<tr><td>Total Percentage</td><td>${data.finalGrades['Total Percentage']}</td></tr>` : ''}
                            ${data.finalGrades['Pass/Fail'] ? `<tr><td>Pass/Fail</td><td>${data.finalGrades['Pass/Fail']}</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="filter-container">
            <div class="filter-bar">
                <label class="filter-bar-label">Academic Year</label>
                <select class="filter-bar-select" id="academic-year">
                    ${yearOptions}
                </select>
                <label class="filter-bar-label">Academic Term</label>
                <select class="filter-bar-select" id="academic-term">
                    <option value="SEM1" ${state.currentTerm === 'SEM1' ? 'selected' : ''}>SEM1</option>
                    <option value="SEM2" ${state.currentTerm === 'SEM2' ? 'selected' : ''}>SEM2</option>
                </select>
                <button type="submit" class="filter-bar-submit" id="filter-submit-btn">Submit</button>
            </div>
            ${reportHTML}
        </div>
        <div class="footer">
            PowerCampus® Self-service 9.1.1 - Copyright 1995-2020 Ellucian Company L.P. and its affiliates.
        </div>
    `;
}

function renderTranscriptReport() {
    const data = courseData[state.currentYear]?.[state.currentTerm];
    
    if (!data) {
        return `
            <div class="header">
                <div class="header-left">
                    <span class="header-logo">ellucian.</span>
                </div>
                <div class="header-right">
                    <div class="header-user">👤 ${state.username}</div>
                    <div class="header-menu-icon">☰</div>
                </div>
            </div>
            <div class="report-container">
                <h1 class="report-title">Grade Report – ${state.currentYear}/${state.currentTerm}</h1>
                <p>No data available for this year and term.</p>
            </div>
            <div class="footer">
                PowerCampus® Self-service 9.1.1 - Copyright 1995-2020 Ellucian Company L.P. and its affiliates.
            </div>
        `;
    }
    
    const coursesHTML = data.courses.map(course => `
        <tr>
            <td>${course.session}</td>
            <td>${course.course}</td>
            <td>${course.name}</td>
            <td>${course.section}</td>
            <td>${course.credits}</td>
            <td>${course.qualityPoints}</td>
        </tr>
    `).join('');
    
    return `
        <div class="header">
            <div class="header-left">
                <span class="header-logo">ellucian.</span>
            </div>
            <div class="header-right">
                <div class="header-user">👤 ${state.username}</div>
                <div class="header-menu-icon">☰</div>
            </div>
        </div>
        <div class="report-container">
            <h1 class="report-title">Grade Report – ${state.currentYear}/${state.currentTerm}</h1>
            
            <div class="report-header">
                <div class="report-info">
                    <div class="report-info-item">
                        <span class="report-info-label">Student Name:</span>
                        <span class="report-info-value">${data.studentInfo.name}</span>
                    </div>
                    <div class="report-info-item">
                        <span class="report-info-label">Degree:</span>
                        <span class="report-info-value">${data.studentInfo.degree}</span>
                    </div>
                    <div class="report-info-item">
                        <span class="report-info-label">Curriculum:</span>
                        <span class="report-info-value">${data.studentInfo.curriculum}</span>
                    </div>
                    <div class="report-info-item">
                        <span class="report-info-label">PeopleId:</span>
                        <span class="report-info-value">${data.studentInfo.peopleId}</span>
                    </div>
                </div>
            </div>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Session</th>
                        <th>Course</th>
                        <th>Name</th>
                        <th>Section</th>
                        <th>Credits</th>
                        <th>Quality Points</th>
                    </tr>
                </thead>
                <tbody>
                    ${coursesHTML}
                </tbody>
            </table>
            
            <div class="final-grades">
                <h3 class="final-grades-title">Final Grades</h3>
                <table class="final-grades-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.finalGrades.SBA ? `<tr><td>SBA</td><td>${data.finalGrades.SBA}</td></tr>` : ''}
                        ${data.finalGrades.OSPE ? `<tr><td>OSPE</td><td>${data.finalGrades.OSPE}</td></tr>` : ''}
                        ${data.finalGrades['SBA Total'] ? `<tr><td>SBA Total</td><td>${data.finalGrades['SBA Total']}</td></tr>` : ''}
                        ${data.finalGrades['OSPE Total'] ? `<tr><td>OSPE Total</td><td>${data.finalGrades['OSPE Total']}</td></tr>` : ''}
                        ${data.finalGrades['Total Percentage'] ? `<tr><td>Total Percentage</td><td>${data.finalGrades['Total Percentage']}</td></tr>` : ''}
                        ${data.finalGrades['Pass/Fail'] ? `<tr><td>Pass/Fail</td><td>${data.finalGrades['Pass/Fail']}</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="footer">
            PowerCampus® Self-service 9.1.1 - Copyright 1995-2020 Ellucian Company L.P. and its affiliates.
        </div>
    `;
}

// Event Handlers
function attachSignInHandlers() {
    const form = document.getElementById('signin-form');
    const usernameInput = document.getElementById('username-input');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            state.username = username;
            navigateTo('welcome');
        }
    });
}

function attachWelcomeHandlers() {
    const form = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');
    const showPassword = document.getElementById('show-password');
    const useAnotherAccount = document.getElementById('use-another-account');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = passwordInput.value.trim();
        if (password) {
            try {
                // Authenticate with database
                const result = await login(state.username, password);
                
                // Store user info in state
                state.userId = result.userId;
                state.studentId = result.studentId;
                state.studentInfo = result.studentInfo;
                
                // Navigate to dashboard
                navigateTo('dashboard');
            } catch (error) {
                alert('Login failed: ' + error.message);
            }
        }
    });
    
    showPassword.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            showPassword.textContent = 'Hide';
        } else {
            passwordInput.type = 'password';
            showPassword.textContent = 'Show';
        }
    });
    
    useAnotherAccount.addEventListener('click', (e) => {
        e.preventDefault();
        state.username = '';
        state.userId = null;
        state.studentId = null;
        state.studentInfo = null;
        navigateTo('signin');
    });
}

function attachDashboardHandlers() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const transcriptLink = document.querySelector('[data-action="transcript"]');
    
    prevMonthBtn?.addEventListener('click', () => {
        state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1);
        render();
    });
    
    nextMonthBtn?.addEventListener('click', () => {
        state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1);
        render();
    });
    
    transcriptLink?.addEventListener('click', (e) => {
        e.preventDefault();
        state.showReport = false;
        navigateTo('transcript-filter');
    });
    
    const gradeReportLink = document.querySelector('[data-action="grade-report"]');
    gradeReportLink?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('transcript-filter');
    });
}

function attachFilterHandlers() {
    const submitBtn = document.getElementById('filter-submit-btn');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const year = document.getElementById('academic-year').value;
            const term = document.getElementById('academic-term').value;
            state.currentYear = year;
            state.currentTerm = term;
            state.showReport = true;
            render();
        });
    }
}

function attachReportHandlers() {
    // Report page handlers if needed
}

// Initialize
function init() {
    // Check if user is already logged in (from sessionStorage)
    const savedUsername = sessionStorage.getItem('username');
    if (savedUsername) {
        state.username = savedUsername;
        state.currentPage = 'dashboard';
    }
    
    render();
}

// Start the app
init();

