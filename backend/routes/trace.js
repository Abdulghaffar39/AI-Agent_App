/**
 * Trace Route
 * GET /api/trace/:requestId - Get agent trace logs
 * GET /api/trace - Get all trace logs
 */
const express = require('express');
const router = express.Router();
const TraceLogger = require('../agents/traceLogger');

// GET /api/trace - all trace logs
router.get('/', (req, res) => {
  const logs = TraceLogger.getAllLogs();
  res.json({ success: true, total: logs.length, logs });
});

// GET /api/trace/:requestId
router.get('/:requestId', (req, res) => {
  const trace = TraceLogger.getByRequestId(req.params.requestId);
  if (!trace) {
    return res.status(404).json({ success: false, error: 'Trace not found' });
  }
  res.json({ success: true, trace });
});

module.exports = router;
