/**
 * Agent 4: Booking Agent
 * Simulates the booking process - slot assignment, confirmation, receipt
 */
const fs = require('fs');
const path = require('path');
const { generateBookingId, parseTimeExpression, getSlotForTimePreference } = require('../utils/helpers');

class BookingAgent {
  constructor() {
    this.name = 'BookingAgent';
    this.bookingsPath = path.join(__dirname, '..', 'data', 'bookings.json');
  }

  async book(provider, intent, userId, traceLogger) {
    const startTime = Date.now();
    
    const bookingId = generateBookingId();
    const timeInfo = parseTimeExpression(intent.time_expression);
    const selectedSlot = getSlotForTimePreference(
      provider.availability.slots,
      timeInfo.timeSlot
    );
    
    // Create booking record
    const booking = {
      bookingId: bookingId,
      userId: userId || 'guest',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      service: {
        type: intent.service_type,
        description: intent.original_message
      },
      provider: {
        id: provider.id,
        name: provider.name,
        nameUrdu: provider.nameUrdu,
        phone: provider.phone,
        area: provider.location.area,
        rating: provider.rating,
        priceRange: provider.priceRange
      },
      schedule: {
        date: timeInfo.date,
        displayDate: timeInfo.displayTime,
        timeSlot: selectedSlot,
        estimatedDuration: '1-2 hours'
      },
      confirmation: {
        message: this.generateConfirmationMessage(bookingId, provider, selectedSlot, timeInfo),
        messageUrdu: this.generateUrduConfirmation(bookingId, provider, selectedSlot, timeInfo),
        sentAt: new Date().toISOString(),
        sentVia: 'SMS & In-App'
      },
      receipt: {
        bookingId: bookingId,
        service: intent.service_type,
        provider: provider.name,
        estimatedCost: provider.priceRange,
        paymentMode: 'Cash on Service',
        generatedAt: new Date().toISOString()
      }
    };
    
    // Save booking to database
    this.saveBooking(booking);
    
    const duration = Date.now() - startTime;
    
    traceLogger.log(
      this.name,
      'Simulate Booking & Confirmation',
      {
        provider: provider.name,
        userId: userId,
        requestedTime: intent.time_expression,
        availableSlots: provider.availability.slots
      },
      {
        bookingId: bookingId,
        status: 'confirmed',
        assignedSlot: selectedSlot,
        scheduledDate: timeInfo.displayTime,
        confirmationSent: true,
        receiptGenerated: true
      },
      `Booking ${bookingId} created successfully. Assigned slot ${selectedSlot} on ${timeInfo.displayTime}. ` +
      `Provider ${provider.name} (${provider.location.area}) confirmed. ` +
      `Confirmation message sent via SMS & In-App. Receipt generated. ` +
      `Estimated cost: ${provider.priceRange}. Payment: Cash on Service.`,
      duration
    );
    
    return booking;
  }

  generateConfirmationMessage(bookingId, provider, slot, timeInfo) {
    return `✅ Booking Confirmed!\n\n` +
      `Booking ID: ${bookingId}\n` +
      `Service: ${provider.service || 'Service'}\n` +
      `Provider: ${provider.name}\n` +
      `📞 Contact: ${provider.phone}\n` +
      `📅 Date: ${timeInfo.displayTime}\n` +
      `🕐 Time: ${slot}\n` +
      `📍 Area: ${provider.location?.area || provider.area}\n` +
      `💰 Estimated: ${provider.priceRange}\n\n` +
      `Your provider will arrive at the scheduled time. You will receive a reminder 1 hour before.`;
  }

  generateUrduConfirmation(bookingId, provider, slot, timeInfo) {
    return `✅ بکنگ کنفرم!\n\n` +
      `بکنگ نمبر: ${bookingId}\n` +
      `سروس: ${provider.nameUrdu || provider.name}\n` +
      `📞 رابطہ: ${provider.phone}\n` +
      `📅 تاریخ: ${timeInfo.displayTime}\n` +
      `🕐 وقت: ${slot}\n` +
      `📍 علاقہ: ${provider.location?.area || provider.area}\n` +
      `💰 تخمینہ: ${provider.priceRange}\n\n` +
      `آپ کا سروس فراہم کنندہ مقررہ وقت پر پہنچ جائے گا۔ اپائنٹمنٹ سے 1 گھنٹہ پہلے ریمائنڈر بھیجا جائے گا۔`;
  }

  saveBooking(booking) {
    try {
      const data = JSON.parse(fs.readFileSync(this.bookingsPath, 'utf-8'));
      data.bookings.push(booking);
      fs.writeFileSync(this.bookingsPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[BookingAgent] Save error:', err.message);
      // Create new file if corrupt
      fs.writeFileSync(this.bookingsPath, JSON.stringify({ bookings: [booking] }, null, 2), 'utf-8');
    }
  }

  // Get bookings by userId
  static getBookings(userId) {
    const bookingsPath = path.join(__dirname, '..', 'data', 'bookings.json');
    try {
      const data = JSON.parse(fs.readFileSync(bookingsPath, 'utf-8'));
      if (userId) {
        return data.bookings.filter(b => b.userId === userId);
      }
      return data.bookings;
    } catch {
      return [];
    }
  }
}

module.exports = BookingAgent;
