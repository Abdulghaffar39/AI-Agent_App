/**
 * KaamWala Backend Server
 * AI Service Orchestrator for Informal Economy
 * 
 * Endpoints:
 *   POST /api/service-request  - Process a service request (main pipeline)
 *   GET  /api/bookings         - Get all bookings
 *   GET  /api/bookings/:userId - Get user bookings
 *   GET  /api/trace            - Get all agent trace logs
 *   GET  /api/trace/:requestId - Get trace for a specific request
 *   GET  /api/health           - Health check
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const serviceRoutes = require('./routes/service');
const bookingRoutes = require('./routes/bookings');
const traceRoutes = require('./routes/trace');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/service-request', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/trace', traceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KaamWala API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'KaamWala - AI Service Orchestrator',
    description: 'Agentic AI system for informal economy service booking',
    endpoints: {
      'POST /api/service-request': 'Process a natural language service request',
      'GET /api/bookings': 'View all bookings',
      'GET /api/bookings/:userId': 'View user bookings',
      'GET /api/trace': 'View all agent trace logs',
      'GET /api/trace/:requestId': 'View trace for specific request',
      'GET /api/health': 'Health check'
    },
    example: {
      method: 'POST',
      url: '/api/service-request',
      body: { message: 'Mujhe kal subah G-13 mein AC technician chahiye', userId: 'user123' }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('  🔧 KaamWala - AI Service Orchestrator');
  console.log('  📍 Informal Economy Service Booking System');
  console.log('='.repeat(60));
  console.log(`  🚀 Server running on http://localhost:${PORT}`);
  console.log(`  🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Not configured ❌'}`);
  console.log(`  📡 Endpoints:`);
  console.log(`     POST /api/service-request`);
  console.log(`     GET  /api/bookings`);
  console.log(`     GET  /api/trace`);
  console.log(`     GET  /api/health`);
  console.log('='.repeat(60) + '\n');
});

module.exports = app;
