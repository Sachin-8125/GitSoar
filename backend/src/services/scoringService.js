import { average, standardDeviation, sum } from '../utils/helpers.js';

/**
 * Calculate Documentation Quality Score (0-100)
 * @param {Array} repos - Repository list with details
 * @returns {number} - Score 0-100
 */
export function calculateDocumentationScore(repos) {
  if (!repos || repos.length === 0) return 0;
  
  const scores = repos.map(repo => {
    let score = 0;
    const readme = repo.readme;
    
    // README exists (40 points)
    if (readme?.exists) {
      score += 40;
      
      // README length (up to 40 points)
      const length = readme.length;
      if (length > 2000) score += 40;
      else if (length > 1000) score += 30;
      else if (length > 500) score += 20;
      else if (length > 200) score += 10;
      
      // Has installation instructions (bonus)
      if (readme.hasInstallation) score += 5;
      if (readme.hasUsage) score += 5;
    }
    
    // Has docs folder (10 points)
    const hasDocs = repo.contents?.some(
      item => item.type === 'dir' && 
      (item.name.toLowerCase() === 'docs' || item.name.toLowerCase() === 'documentation')
    );
    if (hasDocs) score += 10;
    
    // Has contributing guide (10 points)
    if (readme?.hasContributing) score += 10;
    
    return Math.min(score, 100);
  });
  
  return Math.round(average(scores));
}

/**
 * Calculate Code Structure Score (0-100)
 * @param {Array} repos - Repository list with contents
 * @returns {number} - Score 0-100
 */
export function calculateStructureScore(repos) {
  if (!repos || repos.length === 0) return 0;
  
  const scores = repos.map(repo => {
    let score = 0;
    const contents = repo.contents || [];
    const names = contents.map(c => c.name.toLowerCase());
    
    // Has .gitignore (25 points)
    if (names.includes('.gitignore')) score += 25;
    
    // Has dependency/configuration file (25 points)
    const hasConfig = names.some(n => 
      ['package.json', 'requirements.txt', 'cargo.toml', 'pom.xml', 
       'build.gradle', 'gemfile', 'composer.json', 'go.mod', 
       'pyproject.toml', 'setup.py', 'cmakeLists.txt'].includes(n)
    );
    if (hasConfig) score += 25;
    
    // Has standard directory structure (25 points)
    const hasStandardStructure = contents.some(c => 
      c.type === 'dir' && 
      ['src', 'lib', 'test', 'tests', 'spec', 'app', 'source'].includes(c.name.toLowerCase())
    );
    if (hasStandardStructure) score += 25;
    
    // Has CI/CD configuration (25 points)
    const hasCI = contents.some(c => 
      c.type === 'dir' && c.name.toLowerCase() === '.github'
    ) || names.some(n => 
      ['.travis.yml', '.circleci', 'jenkinsfile', 'dockerfile', 'docker-compose.yml'].includes(n)
    );
    if (hasCI) score += 25;
    
    return score;
  });
  
  return Math.round(average(scores));
}

/**
 * Calculate Activity Consistency Score (0-100)
 * @param {Array} commits - Commit list
 * @param {Array} events - Event list
 * @param {Array} repos - Repository list
 * @returns {number} - Score 0-100
 */
export function calculateActivityScore(commits, events, repos) {
  if ((!commits || commits.length === 0) && (!repos || repos.length === 0)) {
    return 0;
  }
  
  let score = 0;
  
  // Get commits from last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const recentCommits = commits.filter(c => new Date(c.date) >= sixMonthsAgo);
  
  // Group by week
  const weeklyCommits = {};
  recentCommits.forEach(commit => {
    const date = new Date(commit.date);
    const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
    weeklyCommits[weekKey] = (weeklyCommits[weekKey] || 0) + 1;
  });
  
  const weeklyValues = Object.values(weeklyCommits);
  
  // Recent activity (last 30 days) - 30 points
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const last30DaysCommits = commits.filter(c => new Date(c.date) >= thirtyDaysAgo);
  
  if (last30DaysCommits.length > 20) score += 30;
  else if (last30DaysCommits.length > 10) score += 25;
  else if (last30DaysCommits.length > 5) score += 20;
  else if (last30DaysCommits.length > 0) score += 10;
  
  // Commit frequency - 40 points
  const avgWeeklyCommits = weeklyValues.length > 0 ? average(weeklyValues) : 0;
  
  if (avgWeeklyCommits >= 10) score += 40;
  else if (avgWeeklyCommits >= 5) score += 30;
  else if (avgWeeklyCommits >= 2) score += 20;
  else if (avgWeeklyCommits >= 1) score += 10;
  
  // Consistency - 30 points
  if (weeklyValues.length > 1) {
    const stdDev = standardDeviation(weeklyValues);
    const consistency = Math.max(0, 1 - (stdDev / (avgWeeklyCommits + 1)));
    score += Math.round(consistency * 30);
  } else if (weeklyValues.length === 1) {
    score += 15; // Some activity is better than none
  }
  
  return Math.min(score, 100);
}

/**
 * Calculate Repository Organization Score (0-100)
 * @param {Array} repos - Repository list
 * @returns {number} - Score 0-100
 */
export function calculateOrganizationScore(repos) {
  if (!repos || repos.length === 0) return 0;
  
  let score = 0;
  
  // Non-fork repositories (25 points)
  const nonForkCount = repos.filter(r => !r.isFork).length;
  const forkRatio = nonForkCount / repos.length;
  score += Math.round(forkRatio * 25);
  
  // Repos with descriptions (25 points)
  const withDescription = repos.filter(r => 
    r.description && r.description.length > 20
  ).length;
  score += Math.round((withDescription / repos.length) * 25);
  
  // Repos with topics (25 points)
  const withTopics = repos.filter(r => 
    r.topics && r.topics.length > 0
  ).length;
  score += Math.round((withTopics / repos.length) * 25);
  
  // Repos with licenses (25 points)
  const withLicense = repos.filter(r => r.license).length;
  score += Math.round((withLicense / repos.length) * 25);
  
  return Math.min(score, 100);
}

/**
 * Calculate Project Impact Score (0-100)
 * @param {Array} repos - Repository list
 * @returns {number} - Score 0-100
 */
export function calculateImpactScore(repos) {
  if (!repos || repos.length === 0) return 0;
  
  let score = 0;
  
  const totalStars = sum(repos.map(r => r.stars));
  const totalForks = sum(repos.map(r => r.forks));
  const hasHomepage = repos.some(r => r.homepage && r.homepage.length > 0);
  
  // Stars (40 points) - logarithmic scale
  const starScore = Math.min(Math.log10(totalStars + 1) * 13, 40);
  score += Math.round(starScore);
  
  // Forks (30 points) - logarithmic scale
  const forkScore = Math.min(Math.log10(totalForks + 1) * 15, 30);
  score += Math.round(forkScore);
  
  // Real-world projects with homepages (30 points)
  if (hasHomepage) score += 30;
  
  return Math.min(score, 100);
}

/**
 * Calculate Technical Depth Score (0-100)
 * @param {Array} repos - Repository list
 * @param {object} languages - Language statistics
 * @returns {number} - Score 0-100
 */
export function calculateTechnicalDepthScore(repos, languages) {
  if (!repos || repos.length === 0) return 0;
  
  let score = 0;
  
  // Language diversity (60 points)
  const languageCount = Object.keys(languages || {}).length;
  
  if (languageCount >= 6) score += 60;
  else if (languageCount >= 4) score += 45;
  else if (languageCount >= 3) score += 35;
  else if (languageCount >= 2) score += 25;
  else score += 15;
  
  // Project complexity based on repo sizes (40 points)
  const totalSize = sum(repos.map(r => r.size));
  const avgSize = totalSize / repos.length;
  
  if (avgSize > 5000) score += 40;
  else if (avgSize > 2000) score += 30;
  else if (avgSize > 1000) score += 20;
  else if (avgSize > 500) score += 10;
  
  return Math.min(score, 100);
}

/**
 * Calculate overall portfolio score with weighted dimensions
 * @param {object} scores - Individual dimension scores
 * @returns {object} - Overall score and breakdown
 */
export function calculateOverallScore(scores) {
  const weights = {
    documentation: 0.20,
    structure: 0.20,
    activity: 0.15,
    organization: 0.15,
    impact: 0.15,
    technical: 0.15
  };
  
  const weightedScores = {
    documentation: Math.round(scores.documentation * weights.documentation),
    structure: Math.round(scores.structure * weights.structure),
    activity: Math.round(scores.activity * weights.activity),
    organization: Math.round(scores.organization * weights.organization),
    impact: Math.round(scores.impact * weights.impact),
    technical: Math.round(scores.technical * weights.technical)
  };
  
  const overall = sum(Object.values(weightedScores));
  
  return {
    overall: Math.min(overall, 100),
    breakdown: {
      raw: scores,
      weighted: weightedScores
    },
    weights
  };
}

/**
 * Get rating based on score
 * @param {number} score - Overall score
 * @returns {object} - Rating info
 */
export function getRating(score) {
  if (score >= 90) {
    return {
      label: 'Excellent',
      emoji: '🏆',
      description: 'Outstanding portfolio, ready for top-tier opportunities',
      color: '#10B981'
    };
  } else if (score >= 75) {
    return {
      label: 'Strong',
      emoji: '✅',
      description: 'Good foundation with minor improvements needed',
      color: '#3B82F6'
    };
  } else if (score >= 50) {
    return {
      label: 'Average',
      emoji: '⚠️',
      description: 'Decent but needs significant work to stand out',
      color: '#F59E0B'
    };
  } else if (score >= 25) {
    return {
      label: 'Weak',
      emoji: '❌',
      description: 'Major gaps identified, prioritize improvements',
      color: '#EF4444'
    };
  } else {
    return {
      label: 'Critical',
      emoji: '🚨',
      description: 'Portfolio requires substantial overhaul',
      color: '#DC2626'
    };
  }
}

/**
 * Calculate all scores for a user
 * @param {object} userData - Complete user data
 * @returns {object} - All calculated scores
 */
export function calculateAllScores(userData) {
  const { repositories, repoDetails, commits, languages } = userData;
  
  const dimensionScores = {
    documentation: calculateDocumentationScore(repoDetails),
    structure: calculateStructureScore(repoDetails),
    activity: calculateActivityScore(commits, [], repositories),
    organization: calculateOrganizationScore(repositories),
    impact: calculateImpactScore(repositories),
    technical: calculateTechnicalDepthScore(repositories, languages)
  };
  
  const { overall, breakdown, weights } = calculateOverallScore(dimensionScores);
  const rating = getRating(overall);
  
  return {
    overall,
    rating,
    dimensions: dimensionScores,
    breakdown,
    weights
  };
}