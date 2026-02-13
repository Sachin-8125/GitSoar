const GITHUB_API_BASE_URL = 'https://api.github.com';

// GitHub API configuration
export const githubConfig = {
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitSoar-Analyzer/1.0.0',
    ...(process.env.GITHUB_TOKEN && {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
    })
  },
  timeout: 30000 // 30 seconds
};

// GitHub API rate limits
export const rateLimits = {
  authenticated: {
    requestsPerHour: 5000,
    requestsPerMinute: 100
  },
  unauthenticated: {
    requestsPerHour: 60,
    requestsPerMinute: 10
  }
};

// Get current rate limit info
export function getRateLimitInfo() {
  return {
    authenticated: !!process.env.GITHUB_TOKEN,
    limit: process.env.GITHUB_TOKEN ? rateLimits.authenticated : rateLimits.unauthenticated
  };
}