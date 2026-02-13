/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    url: req.url,
    method: req.method
  });

  // Handle specific error types
  if (err.response && err.response.status) {
    // Axios error (GitHub API)
    const status = err.response.status;
    const message = err.response.data?.message || err.message;

    if (status === 404) {
      return res.status(404).json({
        success: false,
        message: 'GitHub profile not found. Please check the username.',
        details: message
      });
    }

    if (status === 403) {
      const isRateLimit = message.includes('rate limit') || 
                          err.response.headers?.['x-ratelimit-remaining'] === '0';
      
      if (isRateLimit) {
        const resetTime = err.response.headers?.['x-ratelimit-reset'];
        const resetDate = resetTime ? new Date(resetTime * 1000).toISOString() : null;
        
        return res.status(429).json({
          success: false,
          message: 'GitHub API rate limit exceeded.',
          details: {
            message: 'Please try again later or add a GitHub token for higher limits.',
            resetAt: resetDate,
            limit: err.response.headers?.['x-ratelimit-limit'],
            remaining: 0
          }
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Access forbidden. The profile may be private.',
        details: message
      });
    }

    return res.status(status).json({
      success: false,
      message: 'GitHub API error',
      details: message
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.message
    });
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details
    });
  }

  // Default error response
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
    ...(isDev && { stack: err.stack })
  });
}

/**
 * Async handler wrapper to catch errors
 * @param {Function} fn - Async function
 * @returns {Function} - Express middleware
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}