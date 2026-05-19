/**
 * Service Request Route
 * POST /api/service-request - Main endpoint for processing service requests
 */
const express = require('express');
const router = express.Router();
const Orchestrator = require('../agents/orchestrator');

const orchestrator = new Orchestrator(process.env.GEMINI_API_KEY);

// POST /api/service-request
router.post('/', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required. Please describe the service you need.',
        errorUrdu: 'پیغام ضروری ہے۔ براہ کرم بتائیں آپ کو کون سی سروس چاہیے۔'
      });
    }
    
    console.log(`\n[SERVICE] Processing request from ${userId || 'guest'}: "${message}"`);
    
    const result = await orchestrator.processRequest(message, userId || 'guest');
    
    res.json(result);
    
  } catch (error) {
    console.error('[SERVICE] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.',
      errorUrdu: 'سرور کی خرابی۔ براہ کرم دوبارہ کوشش کریں۔'
    });
  }
});

module.exports = router;
