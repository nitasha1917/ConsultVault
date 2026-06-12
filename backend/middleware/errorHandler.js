const multer = require('multer');

// Normalize errors into a consistent JSON shape
function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err.message || err);

  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'File is too large. Maximum allowed size is 100 MB.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field.',
    };
    return res.status(400).json({
      success: false,
      error: messages[err.code] || `Upload error: ${err.message}`,
    });
  }

  // Our own thrown errors with a status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({ success: false, error: err.message });
  }

  // Generic 500
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}

// 404 handler – must come before errorHandler in app.use() chain
function notFound(req, res) {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
}

// Convenience: create an error with a status code
function createError(message, statusCode = 500) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

module.exports = { errorHandler, notFound, createError };