/**
 * Agent 5: Follow-Up Agent
 * Simulates reminders, status updates, and completion confirmation
 */

class FollowUpAgent {
  constructor() {
    this.name = 'FollowUpAgent';
  }

  async scheduleFollowUps(booking, traceLogger) {
    const startTime = Date.now();
    
    const followUps = [];
    
    // 1. Reminder 1 hour before appointment
    followUps.push({
      type: 'reminder',
      timing: '1 hour before appointment',
      channel: 'SMS & Push Notification',
      status: 'scheduled',
      message: `⏰ Reminder: Your ${booking.service.type} appointment with ${booking.provider.name} is in 1 hour at ${booking.schedule.timeSlot}. Booking ID: ${booking.bookingId}`,
      messageUrdu: `⏰ یاد دہانی: آپ کی ${booking.service.type} اپائنٹمنٹ ${booking.provider.name} کے ساتھ 1 گھنٹے بعد ${booking.schedule.timeSlot} پر ہے۔`
    });
    
    // 2. Provider en-route notification
    followUps.push({
      type: 'status_update',
      timing: '30 minutes before appointment',
      channel: 'Push Notification',
      status: 'scheduled',
      message: `🚗 ${booking.provider.name} is on the way to your location. ETA: 20-30 minutes.`,
      messageUrdu: `🚗 ${booking.provider.name} آپ کے مقام کی طرف آ رہے ہیں۔ متوقع وقت: 20-30 منٹ۔`
    });
    
    // 3. Service started confirmation
    followUps.push({
      type: 'status_update',
      timing: 'At appointment time',
      channel: 'In-App',
      status: 'scheduled',
      message: `🔧 Service has started. ${booking.provider.name} has arrived at your location.`,
      messageUrdu: `🔧 سروس شروع ہو گئی ہے۔ ${booking.provider.name} آپ کے مقام پر پہنچ گئے ہیں۔`
    });
    
    // 4. Completion & rating request
    followUps.push({
      type: 'completion',
      timing: '2 hours after appointment',
      channel: 'SMS & Push Notification',
      status: 'scheduled',
      message: `✅ Service completed! How was your experience with ${booking.provider.name}? Rate now to help others. Booking: ${booking.bookingId}`,
      messageUrdu: `✅ سروس مکمل! ${booking.provider.name} کے ساتھ آپ کا تجربہ کیسا رہا؟ ابھی ریٹنگ دیں۔`
    });
    
    // 5. Payment confirmation
    followUps.push({
      type: 'payment',
      timing: 'After service completion',
      channel: 'In-App & SMS',
      status: 'scheduled',
      message: `💰 Payment of ${booking.receipt.estimatedCost} for ${booking.service.type} service. Payment mode: ${booking.receipt.paymentMode}. Thank you for using KaamWala!`,
      messageUrdu: `💰 ${booking.service.type} سروس کی ادائیگی ${booking.receipt.estimatedCost}۔ ادائیگی: ${booking.receipt.paymentMode}۔ کام والا استعمال کرنے کا شکریہ!`
    });
    
    const duration = Date.now() - startTime;
    
    traceLogger.log(
      this.name,
      'Schedule Follow-Up Automation',
      {
        bookingId: booking.bookingId,
        provider: booking.provider.name,
        scheduledTime: booking.schedule.timeSlot
      },
      {
        totalFollowUps: followUps.length,
        scheduled: followUps.map(f => ({
          type: f.type,
          timing: f.timing,
          channel: f.channel,
          status: f.status
        }))
      },
      `Scheduled ${followUps.length} follow-up actions for booking ${booking.bookingId}: ` +
      `(1) Reminder 1hr before, (2) Provider en-route alert, (3) Service started confirmation, ` +
      `(4) Completion & rating request, (5) Payment confirmation. ` +
      `All notifications will be sent via SMS, Push, and In-App channels.`,
      duration
    );
    
    return followUps;
  }
}

module.exports = FollowUpAgent;
