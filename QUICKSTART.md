# GitSoar Quick Start Guide

Get GitSoar running in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)
- A GitHub account (for testing profiles)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# From the project root
npm run install:all
```

This installs dependencies for both backend and frontend.

### 2. Configure Environment Variables

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env
```

The default values should work for local development.

### 3. (Optional) Add GitHub Token

For higher API rate limits (5,000 vs 60 requests/hour):

1. Go to https://github.com/settings/tokens
2. Generate a new token with `public_repo` scope
3. Add to `backend/.env`:
   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```

### 4. Start the Application

```bash
# Start both backend and frontend
npm run dev
```

You'll see:
- Backend running at http://localhost:3001
- Frontend running at http://localhost:5173

### 5. Test It Out

1. Open http://localhost:5173 in your browser
2. Enter a GitHub profile URL (e.g., `https://github.com/torvalds`)
3. Click "Analyze Profile"
4. Explore your results!

## Common Issues

### Port Already in Use

If ports 3001 or 5173 are busy:

```bash
# Backend: Edit backend/.env
PORT=3002

# Frontend: Edit frontend/.env and update VITE_API_URL
```

### API Rate Limit Exceeded

If you see "API rate limit exceeded":

1. Add a GitHub token (see Step 3)
2. Wait 1 hour for the limit to reset
3. Or try a different profile with fewer repos

### CORS Errors

Make sure your frontend `.env` has the correct backend URL:
```
VITE_API_URL=http://localhost:3001/api
```

## Next Steps

- Read the full [README](README.md) for detailed documentation
- Learn about the [Scoring Algorithm](SCORING_ALGORITHM.md)
- Deploy your own instance following the deployment guide

## Development Commands

```bash
# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build frontend for production
cd frontend && npm run build

# Start production server
cd backend && npm start
```

Happy analyzing! 🚀