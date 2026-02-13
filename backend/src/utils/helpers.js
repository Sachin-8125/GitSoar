/**
 * Calculate average of array
 * @param {number[]} arr - Array of numbers
 * @returns {number} - Average
 */
export function average(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Calculate standard deviation
 * @param {number[]} arr - Array of numbers
 * @returns {number} - Standard deviation
 */
export function standardDeviation(arr) {
  if (!arr || arr.length === 0) return 0;
  const avg = average(arr);
  const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Sum array values
 * @param {number[]} arr - Array of numbers
 * @returns {number} - Sum
 */
export function sum(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0);
}

/**
 * Group array by key
 * @param {Array} arr - Array to group
 * @param {string} key - Key to group by
 * @returns {object} - Grouped object
 */
export function groupBy(arr, key) {
  return arr.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * Format date to relative time
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time string
 */
export function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

/**
 * Format number with K/M suffix
 * @param {number} num - Number to format
 * @returns {string} - Formatted string
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Calculate percentile rank
 * @param {number} value - Value to rank
 * @param {number[]} distribution - Distribution to compare against
 * @returns {number} - Percentile (0-100)
 */
export function calculatePercentile(value, distribution) {
  if (!distribution || distribution.length === 0) return 50;
  const below = distribution.filter(v => v < value).length;
  return Math.round((below / distribution.length) * 100);
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Resolves after delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry async function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retries
 * @returns {any} - Function result
 */
export async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await sleep(delay);
    }
  }
}

/**
 * Parse GitHub repo URL to get owner and name
 * @param {string} url - Repo URL
 * @returns {object|null} - Owner and repo name
 */
export function parseRepoUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}