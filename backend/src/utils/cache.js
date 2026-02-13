import NodeCache from 'node-cache';

const CACHE_DURATION = parseInt(process.env.CACHE_DURATION) || 86400; // 24 hours

// Create cache instance
const cache = new NodeCache({
  stdTTL: CACHE_DURATION,
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: true,
  deleteOnExpire: true
});

/**
 * Get cached value
 * @param {string} key - Cache key
 * @returns {any} - Cached value or undefined
 */
export function getCache(key) {
  return cache.get(key);
}

/**
 * Set cache value
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {boolean} - Success status
 */
export function setCache(key, value, ttl = null) {
  return cache.set(key, value, ttl || CACHE_DURATION);
}

/**
 * Delete cached value
 * @param {string} key - Cache key
 * @returns {number} - Number of deleted entries
 */
export function deleteCache(key) {
  return cache.del(key);
}

/**
 * Check if key exists in cache
 * @param {string} key - Cache key
 * @returns {boolean} - True if exists
 */
export function hasCache(key) {
  return cache.has(key);
}

/**
 * Get cache statistics
 * @returns {object} - Cache stats
 */
export function getCacheStats() {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    vsize: cache.getStats().vsize
  };
}

/**
 * Clear all cache
 * @returns {boolean} - Success status
 */
export function clearCache() {
  return cache.flushAll();
}

/**
 * Generate cache key for GitHub user analysis
 * @param {string} username - GitHub username
 * @returns {string} - Cache key
 */
export function getAnalysisCacheKey(username) {
  return `analysis:${username.toLowerCase()}`;
}

export default cache;