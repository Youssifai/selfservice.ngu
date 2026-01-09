# Ellucian PowerCampus Self-Service Grade Report System

A web application for viewing and managing student grade reports with database integration.

## Features

- Student authentication flow (Sign in → Welcome → Dashboard)
- Grade report viewing with filtering by academic year and term
- Database-backed course and grade management
- RESTful API for data operations

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000`

3. Open the application:
- Open `index.html` in your browser, or
- Navigate to `http://localhost:3000` if serving through the server

## Database

The application uses SQLite database (`database.db`) with the following tables:

- **students**: Student information (name, degree, curriculum, people_id)
- **courses**: Course records (session, course code, name, section, credits, quality points)
- **final_grades**: Final grade scores (SBA, OSPE, etc.)

The database is automatically initialized on first server start with sample data.

## API Endpoints

### GET /api/grade-report
Get grade report data for a specific academic year and term.

**Query Parameters:**
- `academicYear`: Academic year (e.g., "2024")
- `academicTerm`: Academic term (e.g., "SEM1")

**Response:**
```json
{
  "studentInfo": {
    "name": "Youssef Aly",
    "degree": "Medicine",
    "curriculum": "Bachelor of Medicine and Surgery",
    "peopleId": "202300202"
  },
  "courses": [...],
  "finalGrades": {
    "SBA": "113.14",
    "OSPE": "136.50"
  }
}
```

### POST /api/courses
Add or update a course record.

**Body:**
```json
{
  "academicYear": "2024",
  "academicTerm": "SEM1",
  "session": "01",
  "courseCode": "VM 1.1 MDL",
  "courseName": "Vertical Module",
  "section": "01",
  "credits": "3.000",
  "qualityPoints": "0.0000"
}
```

### POST /api/final-grades
Add or update a final grade record.

**Body:**
```json
{
  "academicYear": "2024",
  "academicTerm": "SEM1",
  "gradeType": "SBA",
  "score": "113.14"
}
```

### GET /api/years-terms
Get all available academic years and terms from the database.

## Project Structure

```
.
├── app.js              # Frontend application logic
├── server.js           # Backend server and API
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── package.json        # Node.js dependencies
├── database.db         # SQLite database (created on first run)
└── logs.md            # Development log
```

## Usage

1. **Sign In**: Enter a username and click "Next"
2. **Welcome Page**: Enter password and sign in
3. **Dashboard**: Navigate to "GRADES" → "GRADE REPORT (HEALTH)"
4. **Filter Page**: Select academic year and term, then click "Submit"
5. **View Report**: Grade report displays with courses and final grades

## Development

The application uses:
- **Frontend**: Vanilla JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Database**: SQLite3
- **Styling**: CSS3

## Notes

- The database is automatically seeded with sample data on first run
- The application falls back to hardcoded data if the API is unavailable
- All API calls include error handling with fallback mechanisms
