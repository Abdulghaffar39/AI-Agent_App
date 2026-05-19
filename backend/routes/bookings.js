/**
 * Bookings Route
 * GET /api/bookings/:userId - Get booking history
 * GET /api/bookings - Get all bookings
 */
const express = require('express');
const router = express.Router();
const BookingAgent = require('../agents/bookingAgent');

// GET /api/bookings - all bookings
router.get('/', (req, res) => {
  const bookings = BookingAgent.getBookings();
  res.json({ success: true, total: bookings.length, bookings });
});

// GET /api/bookings/:userId
router.get('/:userId', (req, res) => {
  const bookings = BookingAgent.getBookings(req.params.userId);
  res.json({ success: true, userId: req.params.userId, total: bookings.length, bookings });
});

module.exports = router;
