import axios from 'axios';
import { githubConfig } from '../config/github.js';
import { retryWithBackoff, sleep } from '../utils/helpers.js';

const githubApi = axios.create(githubConfig);

/**
 * Fetch user profile from GitHub
 * @param {string} username - GitHub username
 * @returns {Promise<object>} - User profile data
 */
export async function fetchUserProfile(username) {
  return retryWithBackoff(async () => {
    const response = await githubApi.get(`/users/${username}`);
    const user = response.data;
    
    return {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      email: user.email,
      twitterUsername: user.twitter_username,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      hireable: user.hireable,
      profileUrl: user.html_url
    };
  });
}

/**
 * Fetch repositories for a user
 * @param {string} username - GitHub username
 * @param {number} maxRepos - Maximum repos to fetch (default 30)
 * @returns {Promise<Array>} - Repository list
 */
export async function fetchRepositories(username, maxRepos = 30) {
  return retryWithBackoff(async () => {
    const repos = [];
    let page = 1;
    const perPage = 30;
    
    while (repos.length < maxRepos) {
      const response = await githubApi.get(`/users/${username}/repos`, {
        params: {
          sort: 'updated',
          direction: 'desc',
          per_page: perPage,
          page: page
        }
      });
      
      if (response.data.length === 0) break;
      
      const processedRepos = response.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        isPrivate: repo.private,
        isFork: repo.fork,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        openIssues: repo.open_issues_count,
        defaultBranch: repo.default_branch,
        language: repo.language,
        topics: repo.topics || [],
        license: repo.license?.name || null,
        size: repo.size,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        hasIssues: repo.has_issues,
        hasProjects: repo.has_projects,
        hasDownloads: repo.has_downloads,
        hasWiki: repo.has_wiki,
        hasPages: repo.has_pages,
        archived: repo.archived,
        disabled: repo.disabled
      }));
      
      repos.push(...processedRepos);
      
      if (response.data.length < perPage) break;
      page++;
      
      // Rate limiting protection
      if (page > 3) await sleep(100);
    }
    
    return repos.slice(0, maxRepos);
  });
}

/**
 * Fetch README content for a repository
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @returns {Promise<object|null>} - README info
 */
export async function fetchReadme(owner, repo) {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/readme`, {
      headers: {
        ...githubConfig.headers,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    const content = response.data;
    return {
      exists: true,
      content: content,
      length: content.length,
      hasInstallation: content.toLowerCase().includes('install'),
      hasUsage: content.toLowerCase().includes('usage'),
      hasContributing: content.toLowerCase().includes('contributing'),
      hasLicense: content.toLowerCase().includes('license')
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        exists: false,
        content: '',
        length: 0,
        hasInstallation: false,
        hasUsage: false,
        hasContributing: false,
        hasLicense: false
      };
    }
    throw error;
  }
}

/**
 * Fetch repository languages
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @returns {Promise<object>} - Language statistics
 */
export async function fetchLanguages(owner, repo) {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/languages`);
    return response.data;
  } catch (error) {
    return {};
  }
}

/**
 * Fetch repository contents (for structure analysis)
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @returns {Promise<Array>} - Root directory contents
 */
export async function fetchRepoContents(owner, repo) {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/contents`);
    return response.data.map(item => ({
      name: item.name,
      type: item.type,
      path: item.path,
      size: item.size
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Fetch commit history for a repository
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {number} maxCommits - Maximum commits to fetch
 * @returns {Promise<Array>} - Commit list
 */
export async function fetchCommits(owner, repo, maxCommits = 100) {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/commits`, {
      params: {
        per_page: Math.min(maxCommits, 100)
      }
    });
    
    return response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name,
      email: commit.commit.author?.email,
      date: commit.commit.author?.date,
      url: commit.html_url
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Fetch user events (for activity analysis)
 * @param {string} username - GitHub username
 * @param {number} maxEvents - Maximum events to fetch
 * @returns {Promise<Array>} - Event list
 */
export async function fetchUserEvents(username, maxEvents = 100) {
  try {
    const response = await githubApi.get(`/users/${username}/events`, {
      params: {
        per_page: Math.min(maxEvents, 100)
      }
    });
    
    return response.data.map(event => ({
      id: event.id,
      type: event.type,
      createdAt: event.created_at,
      repo: event.repo?.name
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Check if user has a profile README
 * @param {string} username - GitHub username
 * @returns {Promise<boolean>} - Has profile README
 */
export async function hasProfileReadme(username) {
  try {
    await githubApi.get(`/repos/${username}/${username}/readme`);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Fetch comprehensive data for a user
 * @param {string} username - GitHub username
 * @returns {Promise<object>} - Complete user data
 */
export async function fetchComprehensiveUserData(username) {
  const [profile, repos] = await Promise.all([
    fetchUserProfile(username),
    fetchRepositories(username, 30)
  ]);
  
  // Fetch additional data for each repo (limited to top 10 by stars for performance)
  const topRepos = [...repos]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10);
  
  const repoDetails = await Promise.all(
    topRepos.map(async (repo) => {
      const [readme, languages, contents] = await Promise.all([
        fetchReadme(username, repo.name),
        fetchLanguages(username, repo.name),
        fetchRepoContents(username, repo.name)
      ]);
      
      return {
        ...repo,
        readme,
        languages,
        contents
      };
    })
  );
  
  // Fetch commits for top 5 repos
  const commitsPromises = topRepos
    .slice(0, 5)
    .map(repo => fetchCommits(username, repo.name, 50));
  
  const commitsArrays = await Promise.all(commitsPromises);
  const allCommits = commitsArrays.flat();
  
  // Fetch profile README status
  const hasProfileReadmeStatus = await hasProfileReadme(username);
  
  // Aggregate languages across all repos
  const aggregatedLanguages = {};
  repos.forEach(repo => {
    if (repo.language) {
      aggregatedLanguages[repo.language] = (aggregatedLanguages[repo.language] || 0) + 1;
    }
  });
  
  return {
    profile: {
      ...profile,
      hasProfileReadme: hasProfileReadmeStatus
    },
    repositories: repos,
    repoDetails,
    commits: allCommits,
    languages: aggregatedLanguages,
    fetchedAt: new Date().toISOString()
  };
}