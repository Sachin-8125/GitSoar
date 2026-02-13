# GitSoar Scoring Algorithm Documentation

This document provides a comprehensive explanation of how GitSoar calculates Portfolio Scores.

## Overview

The scoring system evaluates GitHub profiles across **six dimensions** that recruiters consistently value. Each dimension contributes a weighted portion to the overall 0-100 score.

## Scoring Dimensions

### 1. Documentation Quality (20% weight)

**Why it matters**: Clear documentation shows you can communicate effectively and care about user experience.

**Calculation**:
```javascript
// Per repository score (0-100)
function calculateRepoDocScore(repo) {
  let score = 0;
  
  // README exists (40%)
  if (repo.hasReadme) {
    score += 40;
    
    // README length (up to 40%)
    const length = repo.readmeLength;
    if (length > 2000) score += 40;
    else if (length > 1000) score += 30;
    else if (length > 500) score += 20;
    else if (length > 200) score += 10;
  }
  
  // Has dedicated docs folder (10%)
  if (repo.hasDocsFolder) score += 10;
  
  // Has CONTRIBUTING.md (10%)
  if (repo.hasContributing) score += 10;
  
  return score;
}

// Overall dimension score
const dimensionScore = average(repoDocScores);
```

**Benchmarks**:
- 90-100: Comprehensive docs, detailed READMEs, examples
- 70-89: Good READMEs, some documentation
- 50-69: Basic READMEs present
- 0-49: Missing or minimal documentation

### 2. Code Structure & Best Practices (20% weight)

**Why it matters**: Well-structured code demonstrates professionalism and maintainability.

**Calculation**:
```javascript
function calculateStructureScore(repo) {
  let score = 0;
  
  // Has .gitignore (25%)
  if (repo.hasGitignore) score += 25;
  
  // Has dependency file (25%)
  if (repo.hasPackageJson || repo.hasRequirementsTxt || repo.hasCargoToml) {
    score += 25;
  }
  
  // Proper directory structure (25%)
  const hasStandardStructure = 
    repo.directories.includes('src') ||
    repo.directories.includes('lib') ||
    repo.directories.includes('test') ||
    repo.directories.includes('tests');
  if (hasStandardStructure) score += 25;
  
  // Has CI/CD configuration (25%)
  if (repo.hasGithubActions || repo.hasTravis || repo.hasCircleCi) {
    score += 25;
  }
  
  return score;
}
```

**Benchmarks**:
- 90-100: Professional structure, tests, CI/CD
- 70-89: Good organization, standard practices
- 50-69: Basic structure present
- 0-49: Disorganized or missing essentials

### 3. Activity Consistency (15% weight)

**Why it matters**: Regular activity shows sustained interest and reliability.

**Calculation**:
```javascript
function calculateActivityScore(commits) {
  // Group commits by week for last 6 months
  const weeklyCommits = groupCommitsByWeek(commits, 26);
  
  let score = 0;
  
  // Recent activity (30%)
  const lastWeekCommits = weeklyCommits[weeklyCommits.length - 1];
  const twoWeeksAgo = weeklyCommits[weeklyCommits.length - 2];
  if (lastWeekCommits > 0 || twoWeeksAgo > 0) {
    score += 30;
  }
  
  // Commit frequency (40%)
  const avgWeeklyCommits = average(weeklyCommits);
  if (avgWeeklyCommits >= 10) score += 40;
  else if (avgWeeklyCommits >= 5) score += 30;
  else if (avgWeeklyCommits >= 2) score += 20;
  else if (avgWeeklyCommits >= 1) score += 10;
  
  // Consistency (30%)
  // Lower standard deviation = more consistent
  const stdDev = standardDeviation(weeklyCommits);
  const consistency = 1 - Math.min(stdDev / avgWeeklyCommits, 1);
  score += Math.round(consistency * 30);
  
  return score;
}
```

**Benchmarks**:
- 90-100: Very active, consistent daily/weekly commits
- 70-89: Regular activity, few gaps
- 50-69: Moderate activity with some gaps
- 0-49: Sporadic or minimal activity

### 4. Repository Organization (15% weight)

**Why it matters**: Complete, well-described repos show attention to detail.

**Calculation**:
```javascript
function calculateOrganizationScore(repos) {
  let totalScore = 0;
  
  for (const repo of repos) {
    let repoScore = 0;
    
    // Not a fork (25%) - shows original work
    if (!repo.isFork) repoScore += 25;
    
    // Has description (25%)
    if (repo.description && repo.description.length > 20) {
      repoScore += 25;
    }
    
    // Has topics (25%)
    if (repo.topics && repo.topics.length > 0) {
      repoScore += 25;
    }
    
    // Has license (25%)
    if (repo.license) repoScore += 25;
    
    totalScore += repoScore;
  }
  
  return Math.round(totalScore / repos.length);
}
```

**Benchmarks**:
- 90-100: All repos complete with descriptions, topics, licenses
- 70-89: Most repos well-organized
- 50-69: Some organization, room for improvement
- 0-49: Many incomplete repos

### 5. Project Impact & Relevance (15% weight)

**Why it matters**: Stars and forks indicate real-world value and user adoption.

**Calculation**:
```javascript
function calculateImpactScore(repos) {
  const totalStars = sum(repos.map(r => r.stars));
  const totalForks = sum(repos.map(r => r.forks));
  const hasHomepage = repos.some(r => r.homepage && r.homepage.length > 0);
  
  let score = 0;
  
  // Stars (40%) - logarithmic scale
  // 1 star = 5 points, 10 stars = 15 points, 100 stars = 30 points, 1000+ = 40 points
  const starScore = Math.min(Math.log10(totalStars + 1) * 13, 40);
  score += Math.round(starScore);
  
  // Forks (30%) - logarithmic scale
  const forkScore = Math.min(Math.log10(totalForks + 1) * 15, 30);
  score += Math.round(forkScore);
  
  // Real-world projects with homepages (30%)
  if (hasHomepage) score += 30;
  
  return score;
}
```

**Benchmarks**:
- 90-100: Highly starred, widely used projects
- 70-89: Good community engagement
- 50-69: Some recognition
- 0-49: Minimal external engagement

### 6. Technical Depth & Language Diversity (15% weight)

**Why it matters**: Diverse skills show adaptability and broad knowledge.

**Calculation**:
```javascript
function calculateTechnicalDepthScore(repos, languages) {
  let score = 0;
  
  // Language diversity (60%)
  const languageCount = Object.keys(languages).length;
  if (languageCount >= 6) score += 60;
  else if (languageCount >= 4) score += 45;
  else if (languageCount >= 3) score += 35;
  else if (languageCount >= 2) score += 25;
  else score += 15;
  
  // Project complexity (40%)
  // Based on total lines of code and file count
  const totalLOC = sum(repos.map(r => r.totalLinesOfCode || 0));
  const avgFilesPerRepo = average(repos.map(r => r.fileCount || 0));
  
  let complexityScore = 0;
  if (totalLOC > 50000) complexityScore += 20;
  else if (totalLOC > 10000) complexityScore += 15;
  else if (totalLOC > 5000) complexityScore += 10;
  else if (totalLOC > 1000) complexityScore += 5;
  
  if (avgFilesPerRepo > 50) complexityScore += 20;
  else if (avgFilesPerRepo > 20) complexityScore += 15;
  else if (avgFilesPerRepo > 10) complexityScore += 10;
  else if (avgFilesPerRepo > 5) complexityScore += 5;
  
  score += Math.min(complexityScore, 40);
  
  return score;
}
```

**Benchmarks**:
- 90-100: Many languages, complex projects
- 70-89: 3-4 languages, substantial projects
- 50-69: 2-3 languages, moderate complexity
- 0-49: Single language, simple projects

## Overall Score Calculation

```javascript
function calculateOverallScore(dimensions) {
  const weights = {
    documentation: 0.20,
    structure: 0.20,
    activity: 0.15,
    organization: 0.15,
    impact: 0.15,
    technical: 0.15
  };
  
  const overall = 
    dimensions.documentation * weights.documentation +
    dimensions.structure * weights.structure +
    dimensions.activity * weights.activity +
    dimensions.organization * weights.organization +
    dimensions.impact * weights.impact +
    dimensions.technical * weights.technical;
  
  return Math.round(overall);
}
```

## Score Interpretation

|
 Range 
|
 Rating 
|
 Description 
|
|
-------
|
--------
|
-------------
|
|
 90-100 
|
 🏆 Excellent 
|
 Outstanding portfolio demonstrating professional-level work. Ready for competitive positions. 
|
|
 75-89 
|
 ✅ Strong 
|
 Well-developed portfolio with solid fundamentals. Minor improvements recommended. 
|
|
 50-74 
|
 ⚠️ Average 
|
 Decent foundation but needs significant work to stand out. Focus on recommendations. 
|
|
 25-49 
|
 ❌ Weak 
|
 Major gaps in the portfolio. Prioritize documentation and structure improvements. 
|
|
 0-24 
|
 🚨 Critical 
|
 Portfolio requires substantial overhaul. Start with basics: READMEs and organization. 
|
## Insights Generation

### Strengths Identification

Top 3-5 positive aspects are identified based on:
1. Dimensions scoring >80
2. Specific standout metrics (e.g., "100+ stars on repositories")
3. Consistent activity patterns
4. Diverse language usage

### Red Flags Detection

Issues that hurt recruiter perception:
1. Dimensions scoring <40
2. Repos without READMEs (>50%)
3. No activity in 6+ months
4. All repos are forks (no original work)
5. Missing profile README

### Recommendations

Actionable improvements prioritized by impact:
1. **High Impact**: Add README to X repos, create profile README
2. **Medium Impact**: Add descriptions to repos, include topics
3. **Ongoing**: Increase commit consistency, add code comments

## Algorithm Updates

The scoring algorithm is versioned and can be improved over time:

**Current Version**: 1.0.0

**Future Considerations**:
- Code quality analysis (via GitHub's code scanning)
- Issue/PR engagement metrics
- README quality (not just presence)
- Test coverage analysis
- Security best practices

## Limitations

1. **Public Repos Only**: Cannot analyze private repositories
2. **GitHub Only**: Limited to GitHub profiles
3. **API Limits**: Heavy users may hit rate limits
4. **Snapshot in Time**: Scores reflect current state, not progress

## Feedback & Iteration

We continuously refine the algorithm based on:
- User feedback
- Recruiter interviews
- Industry best practices
- Academic research on portfolio evaluation

Have suggestions? Open an issue or discussion!