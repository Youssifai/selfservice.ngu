# Development Logs

## Initial Setup
- Created project structure with index.html, styles.css, and app.js
- Set up basic routing system for page navigation
- Implemented authentication flow (sign in → welcome → dashboard)

## Authentication Flow
- Created sign-in page with username input and "Next" button
- Created welcome page with username display, password input, and "Use another account" link
- Implemented password show/hide functionality
- Added session state management

## Dashboard Implementation
- Created dashboard with "Today's Overview" title
- Implemented calendar widget with month navigation
- Added empty right panel matching screenshot design
- Implemented header navigation with Ellucian branding
- Added user icon and username display in header

## Navigation & Dropdowns
- Implemented Grades dropdown menu with hover functionality
- Added "GRADE REPORT (HEALTH)" and "UNOFFICIAL TRANSCRIPT (HEALTH)" options
- Connected transcript link to filter page

## Transcript Filter Page
- Created academic year selector (2016-2025)
- Created academic term selector (SEM1/SEM2)
- Implemented submit functionality to show report below form
- Added report display on same page after submission

## Transcript Report
- Created grade report display with student information
- Implemented course table with columns: Session, Course, Name, Section, Credits, Quality Points
- Added Final Grades section with SBA and OSPE values
- Made report dynamically update based on selected year/term

## Data Structure
- Created JSON-based course data for multiple years (2023, 2024, 2025)
- Structured data with courses, final grades, and student info
- Made data easily extensible for additional years/terms

## Styling
- Matched Ellucian color scheme (blue header #1e3a5f)
- Implemented background gradient with geometric patterns
- Styled cards with proper shadows and borders
- Matched calendar styling with highlighted current date
- Styled tables and forms to match screenshots

## Final Adjustments
- Fixed calendar to show January 2026 with date 8 highlighted
- Updated transcript filter to show report below form
- Refined styling to match screenshots more closely
- Added proper spacing and layout matching original design

## Grade Report Page Redesign (Pixel-Perfect Match)
- Redesigned grade report page to match old-school Ellucian PowerCampus look
- Changed font family to Arial throughout report section
- Simplified table styling with basic 1px solid borders (#999)
- Removed modern effects (rounded corners, shadows, gradients from report)
- Updated report header and info sections to use table-based layout
- Changed colors to basic black (#000) and gray (#f0f0f0, #e0e0e0)
- Reduced padding and spacing to match minimal design
- Updated final grades section to match old-school styling
- Made table rows alternate background colors (#f9f9f9) for better readability

## Complete Pixel-Perfect Rebuild
- Rebuilt filter bar as horizontal grey bar with gradient background (#e8e8e8 to #e0e0e0)
- Added pagination controls bar with navigation arrows, input fields, and refresh button
- Changed all font sizes to 11px to match screenshot exactly
- Updated filter form to horizontal bar layout matching screenshot
- Added exact border styling (1px solid #999) throughout
- Reduced all padding and margins to match compact old-school design
- Updated student info labels to bold font weight
- Made final grades labels bold to match screenshot
- Adjusted table cell padding to 4px 6px for compact look
- Changed report title font size to 14px with proper spacing

## Sign-In Page Layout Fix
- Moved "Next" button to appear below the username input field
- Restructured form to have button in separate form-group div
- Added margin-bottom spacing between form groups for proper vertical layout

## CSS Style Updates
- Updated .form-group to center content horizontally (justify-content: center)
- Changed .form-group align-items from flex-start to center for vertical centering

## Header Navigation Fixes
- Fixed GRADES dropdown alignment by making dropdown inline-block to match other nav items
- Removed gap between GRADES link and dropdown menu (removed margin-top)
- Added transparent bridge area using ::after pseudo-element for smooth hover navigation
- Positioned dropdown menu flush at top: 100% with no visual gap

## Transcript Filter Page Updates
- Removed header from transcript filter page
- Removed background gradient and pattern from filter page (white background)
- Added flexbox layout to push footer to bottom of screen
- Added body class management to toggle background styles per page

## CSS Style Adjustments from Browser Preview
- Updated .filter-bar to add justify-content: flex-start for proper alignment
- Changed .filter-container margin-left from auto to 0px
- Changed .filter-container margin-right from auto to 450px

## CSS Background Color Updates from Browser Preview
- Changed .header background-color from #1e3a5f (rgb(30, 58, 95)) to rgba(83, 83, 209, 1)
- Changed .btn-primary background-color from #1e3a5f to rgba(57, 57, 184, 1)

## Grade Report Layout and Database Integration
- Updated .filter-container positioning to absolute (top=0px, left=0px, width=397px, height=754px)
- Changed report table styling to only show grey header row, removed alternating row colors
- Converted final grades section to proper HTML table format matching course table
- Updated student info display to single line without background/border/container
- Created Node.js backend server with Express and SQLite database
- Set up database schema with students, courses, and final_grades tables
- Created API endpoints: GET /api/grade-report, POST /api/courses, POST /api/final-grades, GET /api/years-terms
- Updated app.js to fetch data from API instead of hardcoded data
- Added async/await support for API calls with fallback to hardcoded data
- Created package.json with dependencies (express, sqlite3, cors)
- Added .gitignore to exclude node_modules and database files

## Database Authentication Integration
- Added users table to database schema for account management
- Linked students table to users table via user_id foreign key
- Created POST /api/login endpoint for user authentication
- Updated all API endpoints to require user authentication (userId parameter)
- Updated grade-report endpoint to fetch data based on logged-in user's student_id
- Updated courses and final-grades endpoints to use authenticated user's student_id
- Seeded database with 3 accounts:
  - Account 1: username "youssef", password "password123" (Student: Youssef Aly, PeopleId: 202300202)
  - Account 2: username "ahmed", password "password456" (Student: Ahmed Mohamed, PeopleId: 202300203)
  - Account 3: username "tarnim.ahmed.2023", password "Radwan23" (Student: Tarnim Ahmed, PeopleId: 202300014)
- Updated frontend app.js to authenticate against database on login
- Added login() API function to handle authentication requests
- Updated attachWelcomeHandlers() to authenticate user before navigating to dashboard
- Updated state management to store userId, studentId, and studentInfo after login
- Each account now has personalized grade data linked to their student record
- Added Tarnim Ahmed account with complete course data:
  - 2024 SEM1: 4 courses (VM 1.1 MDL, BS 1.1.3 MDL, ID 1.1.2 MDL, IM 1.1.1 MDL) with SBA: 102.86, OSPE: 138.60
  - 2024 SEM2: 3 courses (VM 1.2 MDL, FNM 1.2.2 MDL, CB 1.2.1 MDL) with SBA: 192.62, OSPE: 238.47, plus totals and pass/fail
  - 2025 SEM1: 3 courses (VM 2.1 MDL, ESR 2.1.2 MDL, MMB. 2.1.1 MDL) with SBA: 114.32, OSPE: 136.54
- Updated final grades display to show all grade types dynamically (SBA, OSPE, SBA Total, OSPE Total, Total Percentage, Pass/Fail)

## CSS Style Updates from Browser Preview
- Updated .filter-container width from 397px to 750px
- Added width: 300px to .final-grades (changed from 730px)
- Added padding-bottom: 35px to .report-title (changed from 0px)
- Increased font sizes throughout .filter-container:
  - Filter bar elements: 11px → 12px (.filter-bar, .filter-bar-label, .filter-bar-select, .filter-bar-submit)
  - Pagination elements: 11px → 12px, 12px → 13px, 14px → 15px (.pagination-bar, .pagination-btn, .pagination-input, .pagination-text, .pagination-select, .pagination-refresh)
  - Report elements: 11px → 12px, 14px → 15px (.report-title, .report-header, .report-info, .report-info-item, .report-table and its th/td)
  - Final grades elements: 11px → 12px, 12px → 13px (.final-grades, .final-grades-title, .final-grades-table and its th/td)

## Database Update - Tarnim Ahmed 2025 SEM1 Marks
- Updated Tarnim Ahmed's 2025 SEM1 final grades:
  - SBA: Changed from 114.32 to 114
  - OSPE: Changed from 136.54 to 128
- Server restarted and running on http://localhost:3000

## New Account Creation - Youssef Aly
- Created account with username: youssef.aly.2023, password: Sophy2005
- Student: Youssef Aly, PeopleId: 202300202, Degree: Medicine, Curriculum: Bachelor of Medicine and Surgery
- Added 2024/SEM1 data:
  - 4 courses (VM 1.1 MDL, BS 1.1.3 MDL, ID 1.1.2 MDL, IM 1.1.1 MDL)
  - Final grades: SBA: 113.14, OSPE: 136.50
- Added 2024/SEM2 data:
  - 3 courses (VM 1.2 MDL, FNM 1.2.2 MDL, CB 1.2.1 MDL)
  - Final grades: SBA: 213.89, OSPE: 236.83, SBA Total: 327.03, OSPE Total: 373.33, Total Percentage: 62.53, Pass/Fail: Pass
- Added 2025/SEM1 data:
  - 3 courses (VM 2.1 MDL, ESR 2.1.2 MDL, MMB. 2.1.1 MDL)
  - Final grades: SBA: 112, OSPE: 128

## Git Repository Setup
- Initialized git repository
- Added all project files (excluding node_modules and database.db per .gitignore)
- Created initial commit with all application files
- Set up remote repository: https://github.com/Youssifai/selfservice.ngu.git
- Pushed to main branch successfully
- Repository is now fully synchronized with GitHub

## Vercel Deployment Fix
- Removed SQLite database dependency (not compatible with Vercel serverless functions)
- Converted to hardcoded data for 2 users:
  - youssef.aly.2023 / Sophy2005 (Youssef Aly)
  - tarnim.ahmed.2023 / Radwan23 (Tarnim Ahmed)
- Created Vercel-compatible API structure in api/index.js
- Updated package.json to remove sqlite3 dependency
- Updated app.js to use relative API URLs for Vercel deployment
- Created vercel.json configuration for proper routing
- All grade data is now hardcoded and works without database