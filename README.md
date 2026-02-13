# 🚀 GitSoar - GitHub Profile Analyzer

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Tailwind-3.3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

GitSoar is a comprehensive GitHub Profile Analyzer tool designed to help students and developers improve their GitHub portfolios for recruiters. It generates a detailed Portfolio Score (0-100) across six critical dimensions and provides actionable insights for improvement.

![GitSoar Dashboard](docs/screenshot.png)

## ✨ Features

### Core Functionality
- 🔍 **GitHub Profile Analysis** - Simply paste any GitHub profile URL
- 📊 **Portfolio Score (0-100)** - Weighted scoring across 6 dimensions
- 📈 **Visual Dashboard** - Beautiful charts, progress bars, and insights
- 💡 **Actionable Recommendations** - 3+ specific improvements to boost your profile
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 📄 **Export Reports** - Download analysis as JSON or PDF

### Scoring Dimensions

|
 Dimension 
|
 Weight 
|
 Description 
|
|
-----------
|
--------
|
-------------
|
|
 📝 Documentation Quality 
|
 20% 
|
 README completeness, code comments, docs folders 
|
|
 🏗️ Code Structure 
|
 20% 
|
 Best practices, file organization, naming conventions 
|
|
 📅 Activity Consistency 
|
 15% 
|
 Commit frequency, consistency over time, recency 
|
|
 📁 Repository Organization 
|
 15% 
|
 Descriptions, topics, licenses, completeness 
|
|
 🌟 Project Impact 
|
 15% 
|
 Stars, forks, watchers, real-world relevance 
|
|
 🔧 Technical Depth 
|
 15% 
|
 Language diversity, project complexity 
|
### Analysis Output
- **Overall Score** with visual breakdown
- **Strengths** - Top 3-5 positive aspects recruiters will notice
- **Red Flags** - Issues that could hurt your recruiting chances
- **Recommendations** - Specific, actionable improvements
- **Repository Insights** - Per-repo scoring and highlights
- **Commit Pattern Analysis** - Visual timeline of your activity
- **Language Statistics** - Technology stack breakdown

## 🎥 Demo Video

> 📹 **Watch the demo video** to see GitSoar in action!

### Recording Instructions
To create a demo video showcasing GitSoar:

1. **Setup**
   ```bash
   # Start the application
   npm run dev
   
   # Wait for both backend and frontend to be ready
   # Backend: http://localhost:3001
   # Frontend: http://localhost:5173
   ```

2. **Recording Flow** (Recommended: 2-3 minutes)
   
   | Timestamp | Action | What to Show |
   |-----------|--------|--------------|
   | 0:00-0:10 | Introduction | Landing page, explain the tool's purpose |
   | 0:10-0:30 | Input | Paste a GitHub URL (e.g., `https://github.com/torvalds`) |
   | 0:30-0:45 | Loading | Show the loading spinner with progress updates |
   | 0:45-1:15 | Dashboard | Overall score reveal, animate through dimensions |
   | 1:15-1:35 | Insights | Scroll through strengths, red flags, recommendations |
   | 1:35-1:50 | Repository View | Show repo-specific insights table |
   | 1:50-2:05 | Charts | Highlight commit patterns and language distribution |
   | 2:05-2:20 | Export | Download the report as PDF |
   | 2:20-2:30 | Mobile View | Show responsive design on mobile device |

3. **Recommended Tools**
   - [Loom](https://www.loom.com) - Quick browser recording
   - [OBS Studio](https://obsproject.com) - Professional recording
   - [Screen Studio](https://screenstudio.com) - Mac animated recordings

4. **Upload & Embed**
   ```markdown
   [![GitSoar Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
   ```

### Demo Script Template

```
"Welcome to GitSoar - the GitHub Profile Analyzer that helps students 
stand out to recruiters.

[Navigate to homepage]

Let's analyze a real GitHub profile. I'll use Linus Torvalds' profile 
as an example. Simply paste the GitHub URL and click Analyze.

[Enter URL and submit]

GitSoar fetches public repository data, commits, and languages using 
the GitHub API, then applies our weighted scoring algorithm.

[Show loading state]

Here we go! Linus scores an impressive 87 out of 100 overall.

[Point to score]

The dashboard breaks down your score across six key dimensions that 
recruiters care about. You can see excellent technical depth and 
project impact, with room for improvement in documentation.

[Scroll through dimensions]

Here are the specific insights - his strengths include consistent 
commit activity and diverse language usage. Red flags include some 
repositories lacking comprehensive READMEs.

[Show insights section]

The recommendations section provides 3 actionable steps: add more 
README details, include code comments, and create a profile README.

[Show recommendations]

You can explore individual repositories to see their specific scores...

[Scroll through repo table]

And these charts visualize commit patterns and language distribution.

[Show charts]

Finally, export your full report as a PDF to share with mentors 
or include in applications.

[Click export button]

Try GitSoar today to improve your GitHub portfolio!"
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API**: GitHub REST API v3
- **Caching**: node-cache
- **Rate Limiting**: express-rate-limit
- **CORS**: cors

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 3.3
- **Charts**: Recharts
- **PDF Export**: jsPDF
- **HTTP Client**: Axios

### Development Tools
- **Monorepo**: npm workspaces
- **Dev Server**: concurrently
- **Build**: Vite

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- GitHub account (for testing)
- Optional: GitHub Personal Access Token (for higher API limits)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/gitsoar.git
cd gitsoar

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

This starts:
- Backend API at `http://localhost:3001`
- Frontend at `http://localhost:5173`

### Manual Setup

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env to add optional GITHUB_TOKEN
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional: GitHub Personal Access Token
# Increases API rate limit from 60 to 5,000 requests/hour
# Create at: https://github.com/settings/tokens
GITHUB_TOKEN=ghp_your_token_here

# Cache duration in seconds (default: 86400 = 24 hours)
CACHE_DURATION=86400

# Rate limiting: requests per minute per IP
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

### GitHub Token Setup (Recommended)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo` (read public repositories)
4. Copy the token and add to `backend/.env`

## 📊 Scoring Algorithm

GitSoar uses a weighted scoring algorithm that evaluates your GitHub profile across six dimensions. Each dimension is scored 0-100, then weighted to calculate the overall score.

### Dimension Breakdown

#### 1. Documentation Quality (20%)
```
Base Score Components:
├── README exists per repo: 40 points
├── README length (chars):
│   ├── >1000: 40 points
│   ├── 500-1000: 20 points
│   └── 200-500: 10 points
├── Has docs folder: 10 points
└── Code comment ratio: 10 points

Average across all repos → 0-100 score
```

#### 2. Code Structure & Best Practices (20%)
```
Per Repository:
├── Has .gitignore: 25 points
├── Has package.json/requirements.txt: 25 points
├── Proper directory structure: 25 points
└── Consistent naming conventions: 25 points

Average across all repos → 0-100 score
```

#### 3. Activity Consistency (15%)
```
Based on last 6 months of commits:
├── Recent activity (last 30 days): 30 points
├── Commit frequency (avg per week):
│   ├── >10 commits: 40 points
│   ├── 5-10 commits: 30 points
│   └── 1-5 commits: 15 points
└── Consistency (low std deviation): 30 points

→ 0-100 score
```

#### 4. Repository Organization (15%)
```
Across all repositories:
├── Non-fork repositories: 25 points
├── Repos with descriptions: 25 points
├── Repos with topics/tags: 25 points
└── Repos with licenses: 25 points

→ 0-100 score
```

#### 5. Project Impact & Relevance (15%)
```
Based on total statistics:
├── Total stars (logarithmic scale): 40 points
│   ├── >1000: 40 points
│   ├── 100-1000: 30 points
│   └── 10-100: 15 points
├── Total forks: 30 points
└── Real-world projects (has homepage): 30 points

→ 0-100 score
```

#### 6. Technical Depth & Language Diversity (15%)
```
├── Number of programming languages:
│   ├── 5+: 60 points
│   ├── 3-4: 40 points
│   └── 1-2: 20 points
└── Project complexity (LOC, files): 40 points

→ 0-100 score
```

### Overall Score Calculation
```
Overall = (Doc × 0.20) + (Structure × 0.20) + (Activity × 0.15) +
          (Org × 0.15) + (Impact × 0.15) + (Tech × 0.15)
```

### Score Interpretation

|
 Score 
|
 Rating 
|
 Meaning 
|
|
-------
|
--------
|
---------
|
|
 90-100 
|
 🏆 Excellent 
|
 Outstanding portfolio, ready for top-tier opportunities 
|
|
 75-89 
|
 ✅ Strong 
|
 Good foundation, minor improvements needed 
|
|
 50-74 
|
 ⚠️ Average 
|
 Decent, but significant improvements recommended 
|
|
 25-49 
|
 ❌ Weak 
|
 Needs substantial work before recruiting 
|
|
 0-24 
|
 🚨 Critical 
|
 Major overhaul required 
|
See [SCORING_ALGORITHM.md](SCORING_ALGORITHM.md) for complete documentation.

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Create a new Web Service**
2. **Build Command**: `npm install && cd backend && npm install`
3. **Start Command**: `cd backend && npm start`
4. **Environment Variables**: Add all variables from `.env.example`

### Frontend Deployment (Vercel/Netlify)

1. **Connect to GitHub repository**
2. **Build Command**: `cd frontend && npm run build`
3. **Output Directory**: `frontend/dist`
4. **Environment Variables**: Add `VITE_API_URL` pointing to your backend

### Docker Deployment (Optional)

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d
```

## 📁 Project Structure

```
gitsoar/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utilities
│   │   └── server.js          # Entry point
│   └── package.json
├── frontend/                   # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── lib/               # API clients, validators
│   │   ├── App.jsx            # Main app
│   │   └── main.jsx           # Entry point
│   └── package.json
├── docs/                       # Documentation assets
├── README.md                   # This file
└── package.json               # Monorepo root
```

## 🧪 Testing

### Test Profiles

Try analyzing these profiles to see different score ranges:

|
 Profile 
|
 Expected Score 
|
 Why 
|
|
---------
|
----------------
|
-----
|
|
`torvalds`
|
 85-95 
|
 High activity, impactful projects 
|
|
`facebook`
|
 80-90 
|
 Well-organized, good docs 
|
|
`google`
|
 75-85 
|
 Diverse, but many repos 
|
|
 A new student profile 
|
 30-60 
|
 Room for improvement 
|
### API Rate Limits

|
 Authentication 
|
 Limit 
|
 Reset 
|
|
----------------
|
-------
|
-------
|
|
 None 
|
 60 requests/hour 
|
 Per IP 
|
|
 With Token 
|
 5,000 requests/hour 
|
 Per token 
|
GitSoar caches results for 24 hours to minimize API usage.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GitHub API for providing access to public repository data
- React and Vite teams for excellent developer tools
- Tailwind CSS for rapid UI development

## 📬 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/gitsoar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gitsoar/discussions)
- **Email**: gitsoar@example.com

---

<p align="center">
  Made with ❤️ to help developers showcase their best work
</p>
