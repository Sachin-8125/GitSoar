// GitHub URL patterns
const GITHUB_URL_PATTERNS = [
  /^https:\/\/github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/?$/,
  /^https:\/\/www\.github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/?$/,
  /^github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/?$/,
  /^([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/ // Just username
];

/**
 * Extract GitHub username from various URL formats
 * @param {string} input - GitHub URL or username
 * @returns {string|null} - Extracted username or null
 */
export function extractUsername(input) {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim().toLowerCase();

  for (const pattern of GITHUB_URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validate if input is a valid GitHub profile URL or username
 * @param {string} input - Input to validate
 * @returns {object} - Validation result
 */
export function validateGithubUrl(input) {
  if (!input || typeof input !== 'string') {
    return {
      valid: false,
      error: 'Input is required'
    };
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Input cannot be empty'
    };
  }

  if (trimmed.length > 100) {
    return {
      valid: false,
      error: 'Input is too long'
    };
  }

  const username = extractUsername(trimmed);

  if (!username) {
    return {
      valid: false,
      error: 'Invalid GitHub URL format. Use: https://github.com/username'
    };
  }

  // Validate username format (GitHub rules)
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username)) {
    return {
      valid: false,
      error: 'Invalid GitHub username format'
    };
  }

  if (username.length > 39) {
    return {
      valid: false,
      error: 'GitHub username too long (max 39 characters)'
    };
  }

  // Reserved words that can't be usernames
  const reservedWords = ['api', 'www', 'mail', 'ftp', 'localhost', 'admin'];
  if (reservedWords.includes(username)) {
    return {
      valid: false,
      error: 'Invalid username (reserved word)'
    };
  }

  return {
    valid: true,
    username
  };
}

/**
 * Sanitize username for safe usage
 * @param {string} username - Raw username
 * @returns {string} - Sanitized username
 */
export function sanitizeUsername(username) {
  return username.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
}