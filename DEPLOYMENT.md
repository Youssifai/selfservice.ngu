# Deployment Guide

This application is configured for deployment on Vercel with serverless functions.

## Prerequisites

- Node.js 14.x or higher
- Vercel account (free tier works)
- Git repository

## Deployment Steps

### 1. Prepare Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Option B: Using GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration
5. Click "Deploy"

### 3. Configuration

The application uses:
- **API Routes**: Serverless functions in `/api` directory
- **Static Files**: HTML, CSS, JS files served directly
- **Hardcoded Data**: No database required (optimized for serverless)

### 4. Environment Variables

No environment variables are required for this deployment.

## Local Development

For local development with SQLite database:

```bash
# Install dependencies
npm install

# Start local server
npm start

# Server runs on http://localhost:3000
```

## API Endpoints

All API endpoints are available at `/api/*`:

- `POST /api/login` - User authentication
- `GET /api/grade-report` - Get grade report data

## Test Accounts

- **Username**: `youssef.aly.2023` / **Password**: `Sophy2005`
- **Username**: `tarnim.ahmed.2023` / **Password**: `Radwan23`

## Notes

- The Vercel deployment uses hardcoded data (no database)
- Local development uses SQLite database
- API automatically detects environment (local vs production)
- All static assets are served from the root directory
