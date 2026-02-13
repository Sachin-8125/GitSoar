import { average, formatNumber, groupBy } from '../utils/helpers.js';

/**
 * Generate strengths based on high-scoring dimensions
 * @param {object} scores - Dimension scores
 * @param {object} userData - Complete user data
 * @returns {Array} - List of strengths
 */
export function generateStrengths(scores, userData) {
  const strengths = [];
  const { repositories, repoDetails, commits, profile, languages } = userData;
  
  // Documentation strength
  if (scores.documentation >= 80) {
    strengths.push({
      category: 'Documentation',
      title: 'Excellent Documentation',
      description: 'Your repositories have comprehensive READMEs with clear instructions. Recruiters value developers who can communicate effectively.',
      icon: 'document-text'
    });
  }
  
  // Code structure strength
  if (scores.structure >= 80) {
    strengths.push({
      category: 'Structure',
      title: 'Professional Code Organization',
      description: 'Your projects follow industry best practices with proper structure, configuration files, and CI/CD setup.',
      icon: 'code-bracket'
    });
  }
  
  // Activity strength
  if (scores.activity >= 80) {
    const recentCommits = commits.filter(c => {
      const date = new Date(c.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    });
    
    strengths.push({
      category: 'Activity',
      title: 'Consistent Development Activity',
      description: `You've maintained excellent commit consistency with ${recentCommits.length} commits in the last 30 days. This shows dedication and reliability.`,
      icon: 'clock'
    });
  }
  
  // Organization strength
  if (scores.organization >= 80) {
    const nonForkCount = repositories.filter(r => !r.isFork).length;
    strengths.push({
      category: 'Organization',
      title: 'Well-Organized Repository Portfolio',
      description: `${nonForkCount} original repositories with proper descriptions, topics, and licenses demonstrate attention to detail.`,
      icon: 'folder'
    });
  }
  
  // Impact strength
  if (scores.impact >= 70) {
    const totalStars = repositories.reduce((sum, r) => sum + r.stars, 0);
    const totalForks = repositories.reduce((sum, r) => sum + r.forks, 0);
    
    strengths.push({
      category: 'Impact',
      title: 'Community Recognition',
      description: `Your projects have earned ${formatNumber(totalStars)} stars and ${formatNumber(totalForks)} forks, showing real-world value and adoption.`,
      icon: 'star'
    });
  }
  
  // Technical depth strength
  if (scores.technical >= 80) {
    const langCount = Object.keys(languages).length;
    strengths.push({
      category: 'Technical',
      title: 'Diverse Technical Skills',
      description: `Proficiency in ${langCount} programming languages shows adaptability and a broad technical foundation.`,
      icon: 'cpu-chip'
    });
  }
  
  // Profile README strength
  if (profile.hasProfileReadme) {
    strengths.push({
      category: 'Profile',
      title: 'Professional GitHub Profile',
      description: 'Your profile README creates a strong first impression and showcases your personality and skills effectively.',
      icon: 'user'
    });
  }
  
  // Popular repo strength
  const popularRepo = repositories.reduce((max, r) => r.stars > max.stars ? r : max, repositories[0]);
  if (popularRepo && popularRepo.stars >= 50) {
    strengths.push({
      category: 'Project',
      title: 'Notable Open Source Project',
      description: `"${popularRepo.name}" has gained significant traction with ${formatNumber(popularRepo.stars)} stars, demonstrating your ability to build useful tools.`,
      icon: 'trophy'
    });
  }
  
  return strengths.slice(0, 5);
}

/**
 * Generate red flags based on low-scoring areas
 * @param {object} scores - Dimension scores
 * @param {object} userData - Complete user data
 * @returns {Array} - List of red flags
 */
export function generateRedFlags(scores, userData) {
  const redFlags = [];
  const { repositories, repoDetails, commits, profile } = userData;
  
  // Documentation issues
  if (scores.documentation < 50) {
    const reposWithoutReadme = repoDetails.filter(r => !r.readme?.exists).length;
    if (reposWithoutReadme > 0) {
      redFlags.push({
        category: 'Documentation',
        title: 'Missing README Files',
        description: `${reposWithoutReadme} of your repositories lack README files. This makes it difficult for recruiters to understand your projects.`,
        severity: 'high',
        icon: 'exclamation-triangle'
      });
    }
  }
  
  // Activity issues
  if (scores.activity < 40) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentCommits = commits.filter(c => new Date(c.date) >= sixMonthsAgo);
    
    if (recentCommits.length === 0) {
      redFlags.push({
        category: 'Activity',
        title: 'No Recent Activity',
        description: 'No commits in the last 6 months. Inactive profiles may signal a lack of current coding practice or interest.',
        severity: 'high',
        icon: 'pause-circle'
      });
    } else if (recentCommits.length < 10) {
      redFlags.push({
        category: 'Activity',
        title: 'Low Commit Activity',
        description: 'Sparse commit history suggests inconsistent development practices. Aim for regular, meaningful commits.',
        severity: 'medium',
        icon: 'chart-bar'
      });
    }
  }
  
  // Organization issues
  if (scores.organization < 40) {
    const forksOnly = repositories.every(r => r.isFork);
    if (forksOnly) {
      redFlags.push({
        category: 'Originality',
        title: 'No Original Projects',
        description: 'All your repositories are forks. Recruiters want to see your original work and problem-solving abilities.',
        severity: 'critical',
        icon: 'document-duplicate'
      });
    }
    
    const missingDescriptions = repositories.filter(r => !r.description).length;
    if (missingDescriptions > repositories.length * 0.5) {
      redFlags.push({
        category: 'Organization',
        title: 'Missing Repository Descriptions',
        description: `${missingDescriptions} repositories lack descriptions. Clear descriptions help recruiters quickly understand your work.`,
        severity: 'medium',
        icon: 'annotation'
      });
    }
  }
  
  // Impact issues
  if (scores.impact < 30 && repositories.length > 5) {
    redFlags.push({
      category: 'Impact',
      title: 'Limited Community Engagement',
      description: 'Despite having multiple repositories, there\'s minimal community engagement. Consider promoting your projects or contributing to popular open-source projects.',
      severity: 'low',
      icon: 'users'
    });
  }
  
  // Profile README
  if (!profile.hasProfileReadme) {
    redFlags.push({
      category: 'Profile',
      title: 'Missing Profile README',
      description: 'A profile README is your first impression. Without one, you\'re missing an opportunity to introduce yourself to recruiters.',
      severity: 'medium',
      icon: 'identification'
    });
  }
  
  // Structure issues
  if (scores.structure < 40) {
    redFlags.push({
      category: 'Structure',
      title: 'Inconsistent Project Structure',
      description: 'Some projects lack standard configuration files like .gitignore or package.json. These are expected in professional projects.',
      severity: 'medium',
      icon: 'wrench'
    });
  }
  
  return redFlags;
}

/**
 * Generate actionable recommendations
 * @param {object} scores - Dimension scores
 * @param {object} userData - Complete user data
 * @returns {Array} - List of recommendations
 */
export function generateRecommendations(scores, userData) {
  const recommendations = [];
  const { repositories, repoDetails, profile } = userData;
  
  // Documentation recommendations
  if (scores.documentation < 70) {
    const reposWithoutReadme = repoDetails.filter(r => !r.readme?.exists);
    
    if (reposWithoutReadme.length > 0) {
      recommendations.push({
        priority: scores.documentation < 40 ? 'high' : 'medium',
        category: 'Documentation',
        title: 'Add README Files',
        description: `Create README.md files for your top ${Math.min(reposWithoutReadme.length, 3)} repositories. Include: project description, installation steps, usage examples, and screenshots.`,
        impact: 'High',
        icon: 'document-add',
        action: 'Start with your most starred repository'
      });
    }
    
    recommendations.push({
      priority: 'medium',
      category: 'Documentation',
      title: 'Improve Code Comments',
      description: 'Add inline comments to complex code sections and create documentation for public APIs. This shows you care about maintainability.',
      impact: 'Medium',
      icon: 'chat-alt-2'
    });
  }
  
  // Profile README recommendation
  if (!profile.hasProfileReadme) {
    recommendations.push({
      priority: 'high',
      category: 'Profile',
      title: 'Create a Profile README',
      description: 'Create a special repository named after your username and add a README.md. Introduce yourself, showcase your skills, and add contact information.',
      impact: 'High',
      icon: 'user-add',
      action: 'Create repository: ' + profile.username
    });
  }
  
  // Activity recommendations
  if (scores.activity < 60) {
    recommendations.push({
      priority: 'high',
      category: 'Activity',
      title: 'Establish Consistent Commit Habits',
      description: 'Aim for at least 3-5 commits per week across your projects. Regular activity signals reliability and ongoing skill development.',
      impact: 'High',
      icon: 'calendar',
      action: 'Set a weekly coding schedule'
    });
  }
  
  // Organization recommendations
  if (scores.organization < 60) {
    const reposMissingDesc = repositories.filter(r => !r.description);
    if (reposMissingDesc.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'Organization',
        title: 'Add Repository Descriptions',
        description: 'Add clear, concise descriptions to all repositories. Include: what it does, technologies used, and current status.',
        impact: 'Medium',
        icon: 'tag',
        action: `Update ${reposMissingDesc.length} repositories`
      });
    }
    
    const reposMissingTopics = repositories.filter(r => !r.topics || r.topics.length === 0);
    if (reposMissingTopics.length > 0) {
      recommendations.push({
        priority: 'low',
        category: 'Organization',
        title: 'Add Repository Topics',
        description: 'Tag your repositories with relevant topics (languages, frameworks, domains) to improve discoverability.',
        impact: 'Low',
        icon: 'hashtag',
        action: 'Add 3-5 topics per repository'
      });
    }
  }
  
  // Structure recommendations
  if (scores.structure < 60) {
    recommendations.push({
      priority: 'medium',
      category: 'Structure',
      title: 'Add .gitignore Files',
      description: 'Ensure all repositories have appropriate .gitignore files. This keeps repositories clean and professional.',
      impact: 'Medium',
      icon: 'shield',
      action: 'Use gitignore.io for language-specific templates'
    });
    
    recommendations.push({
      priority: 'low',
      category: 'Structure',
      title: 'Set Up CI/CD',
      description: 'Add GitHub Actions workflows for automated testing and deployment. This demonstrates DevOps awareness.',
      impact: 'Medium',
      icon: 'play-circle',
      action: 'Start with a simple test workflow'
    });
  }
  
  // Impact recommendations
  if (scores.impact < 50) {
    recommendations.push({
      priority: 'medium',
      category: 'Impact',
      title: 'Share Your Projects',
      description: 'Share your best projects on social media, developer forums, or with your network. Create demo videos or write blog posts about them.',
      impact: 'High',
      icon: 'share',
      action: 'Post on Twitter, LinkedIn, or Dev.to'
    });
  }
  
  // Technical depth recommendations
  if (scores.technical < 60) {
    recommendations.push({
      priority: 'low',
      category: 'Technical',
      title: 'Diversify Your Tech Stack',
      description: 'Experiment with new languages or frameworks. Contributing to projects in different tech stacks broadens your appeal.',
      impact: 'Medium',
      icon: 'beaker',
      action: 'Try one new technology this month'
    });
  }
  
  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Analyze commit patterns over time
 * @param {Array} commits - Commit list
 * @returns {object} - Commit pattern analysis
 */
export function analyzeCommitPatterns(commits) {
  if (!commits || commits.length === 0) {
    return {
      totalCommits: 0,
      averagePerWeek: 0,
      mostActiveDay: null,
      activityTrend: 'no-data',
      weeklyData: []
    };
  }
  
  // Group by week
  const weeklyData = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const count = commits.filter(c => {
      const date = new Date(c.date);
      return date >= weekStart && date < weekEnd;
    }).length;
    
    weeklyData.push({
      week: weekStart.toISOString().split('T')[0],
      commits: count
    });
  }
  
  // Group by day of week
  const dayOfWeek = groupBy(commits, c => new Date(c.date).getDay());
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = days.map((day, index) => ({
    day,
    count: dayOfWeek[index]?.length || 0
  }));
  const mostActiveDay = dayCounts.reduce((max, d) => d.count > max.count ? d : max, dayCounts[0]);
  
  // Calculate trend
  const firstHalf = weeklyData.slice(0, 6).reduce((sum, w) => sum + w.commits, 0);
  const secondHalf = weeklyData.slice(6).reduce((sum, w) => sum + w.commits, 0);
  let activityTrend = 'stable';
  if (secondHalf > firstHalf * 1.3) activityTrend = 'increasing';
  else if (secondHalf < firstHalf * 0.7) activityTrend = 'decreasing';
  
  const totalCommits = commits.length;
  const averagePerWeek = average(weeklyData.map(w => w.commits));
  
  return {
    totalCommits,
    averagePerWeek: Math.round(averagePerWeek * 10) / 10,
    mostActiveDay: mostActiveDay.day,
    activityTrend,
    weeklyData,
    dayOfWeekDistribution: dayCounts
  };
}

/**
 * Analyze language distribution
 * @param {object} languages - Language statistics
 * @param {Array} repoDetails - Repository details with languages
 * @returns {object} - Language analysis
 */
export function analyzeLanguages(languages, repoDetails) {
  if (!languages || Object.keys(languages).length === 0) {
    return {
      totalLanguages: 0,
      primaryLanguage: null,
      distribution: [],
      diversityScore: 0
    };
  }
  
  const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
  const distribution = Object.entries(languages)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
  
  const primaryLanguage = distribution[0];
  
  // Calculate diversity (Shannon entropy simplified)
  const diversityScore = Math.min(Object.keys(languages).length * 10, 100);
  
  return {
    totalLanguages: Object.keys(languages).length,
    primaryLanguage: primaryLanguage?.name || null,
    distribution: distribution.slice(0, 8),
    diversityScore
  };
}

/**
 * Generate per-repository insights
 * @param {Array} repoDetails - Repository details
 * @returns {Array} - Repository insights
 */
export function generateRepositoryInsights(repoDetails) {
  if (!repoDetails || repoDetails.length === 0) return [];
  
  return repoDetails.map(repo => {
    const insights = [];
    
    if (repo.stars >= 50) {
      insights.push({ type: 'success', text: 'Popular project' });
    }
    if (!repo.readme?.exists) {
      insights.push({ type: 'warning', text: 'Missing README' });
    }
    if (repo.isFork) {
      insights.push({ type: 'info', text: 'Forked repository' });
    }
    if (repo.license) {
      insights.push({ type: 'success', text: 'Has license' });
    }
    if (repo.topics?.length > 0) {
      insights.push({ type: 'info', text: `${repo.topics.length} topics` });
    }
    
    // Calculate individual repo score
    let score = 0;
    if (repo.readme?.exists) score += 40;
    if (repo.readme?.length > 500) score += 20;
    if (repo.license) score += 15;
    if (repo.topics?.length > 0) score += 15;
    if (repo.description) score += 10;
    
    return {
      name: repo.name,
      url: repo.url,
      stars: repo.stars,
      forks: repo.forks,
      language: repo.language,
      updatedAt: repo.updatedAt,
      score: Math.min(score, 100),
      insights
    };
  }).sort((a, b) => b.stars - a.stars);
}

/**
 * Generate complete analysis
 * @param {object} scores - Calculated scores
 * @param {object} userData - Complete user data
 * @returns {object} - Complete analysis
 */
export function generateCompleteAnalysis(scores, userData) {
  return {
    strengths: generateStrengths(scores.dimensions, userData),
    redFlags: generateRedFlags(scores.dimensions, userData),
    recommendations: generateRecommendations(scores.dimensions, userData),
    commitPatterns: analyzeCommitPatterns(userData.commits),
    languageAnalysis: analyzeLanguages(userData.languages, userData.repoDetails),
    repositoryInsights: generateRepositoryInsights(userData.repoDetails),
    generatedAt: new Date().toISOString()
  };
}