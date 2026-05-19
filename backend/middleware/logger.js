/**
 * Request logging middleware
 * Logs all incoming API requests with timestamps
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log(`\n[${timestamp}] ${req.method} ${req.originalUrl}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[REQUEST BODY]`, JSON.stringify(req.body, null, 2));
  }
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[RESPONSE] ${res.statusCode} | ${duration}ms`);
  });
  
  next();
}

module.exports = requestLogger;
