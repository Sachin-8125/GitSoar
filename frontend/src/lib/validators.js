const GITHUB_URL_PATTERNS = [
  /^https:\/\/github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/?$/i,
  /^https:\/\/www\.github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/?$/i,
  /^github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/?$/i,
  /^([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/ // Just username
];

export const extractUsername = (input) => {
  if (!input || typeof input !== 'string') return null;
  
  const trimmed = input.trim().toLowerCase();
  
  for (const pattern of GITHUB_URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

export const validateGithubUrl = (input) => {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input is required' };
  }
  
  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Input cannot be empty' };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: 'Input is too long' };
  }
  
  const username = extractUsername(trimmed);
  
  if (!username) {
    return {
      valid: false,
      error: 'Invalid GitHub URL format. Use: https://github.com/username'
    };
  }
  
  return { valid: true, username };
};