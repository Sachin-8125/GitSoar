import { validateGithubUrl } from '../utils/validators.js';
import { getCache, setCache, getAnalysisCacheKey } from '../utils/cache.js';
import { fetchComprehensiveUserData } from '../services/githubService.js';
import { calculateAllScores } from '../services/scoringService.js';
import { generateCompleteAnalysis } from '../services/analysisService.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { getRateLimitInfo } from '../config/github.js';

/**
 * Analyze a GitHub profile
 * POST /api/analyze
 */
export const analyzeProfile = asyncHandler(async (req, res) => {
  const { githubUrl } = req.body;
  
  // Validate input
  if (!githubUrl) {
    throw new ApiError('GitHub URL is required', 400);
  }
  
  const validation = validateGithubUrl(githubUrl);
  if (!validation.valid) {
    throw new ApiError(validation.error, 400);
  }
  
  const username = validation.username;
  const cacheKey = getAnalysisCacheKey(username);
  
  // Check cache
  const cached = getCache(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: 'Analysis retrieved from cache',
      data: {
        ...cached,
        cached: true,
        cachedAt: cached.analyzedAt
      }
    });
  }
  
  // Fetch comprehensive data
  console.log(`[${new Date().toISOString()}] Analyzing profile: ${username}`);
  const startTime = Date.now();
  
  const userData = await fetchComprehensiveUserData(username);
  
  // Calculate scores
  const scores = calculateAllScores(userData);
  
  // Generate analysis
  const analysis = generateCompleteAnalysis(scores, userData);
  
  const response = {
    profile: {
      username: userData.profile.username,
      name: userData.profile.name,
      avatarUrl: userData.profile.avatarUrl,
      bio: userData.profile.bio,
      location: userData.profile.location,
      company: userData.profile.company,
      blog: userData.profile.blog,
      followers: userData.profile.followers,
      following: userData.profile.following,
      publicRepos: userData.profile.publicRepos,
      profileUrl: userData.profile.profileUrl,
      hasProfileReadme: userData.profile.hasProfileReadme,
      createdAt: userData.profile.createdAt
    },
    scores: {
      overall: scores.overall,
      rating: scores.rating,
      dimensions: scores.dimensions,
      breakdown: scores.breakdown,
      weights: scores.weights
    },
    analysis,
    stats: {
      totalRepos: userData.repositories.length,
      originalRepos: userData.repositories.filter(r => !r.isFork).length,
      totalStars: userData.repositories.reduce((sum, r) => sum + r.stars, 0),
      totalForks: userData.repositories.reduce((sum, r) => sum + r.forks, 0),
      languages: Object.keys(userData.languages).length
    },
    analyzedAt: new Date().toISOString(),
    analysisDuration: Date.now() - startTime
  };
  
  // Cache the result
  setCache(cacheKey, response);
  
  console.log(`[${new Date().toISOString()}] Analysis complete for ${username}: ${scores.overall}/100 (${scores.rating.label})`);
  
  res.status(200).json({
    success: true,
    message: 'Profile analysis complete',
    data: response
  });
});

/**
 * Get analysis by username (for sharing)
 * GET /api/analysis/:username
 */
export const getAnalysis = asyncHandler(async (req, res) => {
  const { username } = req.params;
  
  if (!username) {
    throw new ApiError('Username is required', 400);
  }
  
  const cacheKey = getAnalysisCacheKey(username);
  const cached = getCache(cacheKey);
  
  if (!cached) {
    throw new ApiError('Analysis not found. Please analyze the profile first.', 404);
  }
  
  res.status(200).json({
    success: true,
    message: 'Analysis retrieved',
    data: cached
  });
});

/**
 * Get API status and rate limits
 * GET /api/status
 */
export const getStatus = asyncHandler(async (req, res) => {
  const rateLimitInfo = getRateLimitInfo();
  
  res.status(200).json({
    success: true,
    message: 'API status',
    data: {
      status: 'operational',
      version: '1.0.0',
      githubApi: rateLimitInfo,
      features: {
        caching: true,
        rateLimiting: true,
        analysis: true
      }
    }
  });
});

/**
 * Get example profiles for testing
 * GET /api/examples
 */
export const getExampleProfiles = asyncHandler(async (req, res) => {
  const examples = [
    {
      username: 'torvalds',
      name: 'Linus Torvalds',
      description: 'Creator of Linux kernel - Expect high scores for impact and technical depth',
      expectedScore: '85-95'
    },
    {
      username: 'facebook',
      name: 'Meta (Facebook)',
      description: 'Organization account - Well-organized repositories',
      expectedScore: '80-90'
    },
    {
      username: 'google',
      name: 'Google',
      description: 'Organization with diverse projects',
      expectedScore: '75-85'
    },
    {
      username: 'microsoft',
      name: 'Microsoft',
      description: 'Large organization with extensive open source',
      expectedScore: '80-90'
    }
  ];
  
  res.status(200).json({
    success: true,
    message: 'Example profiles for testing',
    data: examples
  });
});