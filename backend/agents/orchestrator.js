/**
 * Agent Orchestrator
 * Coordinates all 5 agents in a sequential pipeline
 * Planning → Decision → Action → Follow-up
 */
const TraceLogger = require('./traceLogger');
const IntentParser = require('./intentParser');
const ProviderFinder = require('./providerFinder');
const Ranker = require('./ranker');
const BookingAgent = require('./bookingAgent');
const FollowUpAgent = require('./followUpAgent');

class Orchestrator {
  constructor(geminiApiKey) {
    this.intentParser = new IntentParser(geminiApiKey);
    this.providerFinder = new ProviderFinder();
    this.ranker = new Ranker();
    this.bookingAgent = new BookingAgent();
    this.followUpAgent = new FollowUpAgent();
  }

  /**
   * Execute the full agentic pipeline
   * @param {string} userMessage - Natural language service request
   * @param {string} userId - User identifier
   * @returns {object} Complete pipeline result with trace logs
   */
  async processRequest(userMessage, userId) {
    const { v4: uuidv4 } = require('uuid');
    const requestId = uuidv4 ? uuidv4() : `req_${Date.now()}`;
    const traceLogger = new TraceLogger(requestId);
    
    console.log('\n' + '='.repeat(60));
    console.log(`[ORCHESTRATOR] New Request: ${requestId}`);
    console.log(`[ORCHESTRATOR] Message: "${userMessage}"`);
    console.log('='.repeat(60));
    
    // Log pipeline start
    traceLogger.log(
      'Orchestrator',
      'Pipeline Started',
      { userMessage, userId },
      { requestId, pipelineStages: ['IntentParsing', 'ProviderDiscovery', 'Ranking', 'Booking', 'FollowUp'] },
      'Starting 5-stage agentic pipeline: Intent Parsing → Provider Discovery → Ranking & Recommendation → Booking Simulation → Follow-up Automation',
      0
    );

    try {
      // ===== STAGE 1: Intent Parsing =====
      console.log('\n[STAGE 1/5] Parsing user intent...');
      const intent = await this.intentParser.parse(userMessage, traceLogger);
      
      // ===== STAGE 2: Provider Discovery =====
      console.log('[STAGE 2/5] Finding providers...');
      const providers = await this.providerFinder.find(intent, traceLogger);
      
      if (providers.length === 0) {
        traceLogger.log(
          'Orchestrator', 'No Providers Found',
          { intent },
          { error: 'No matching providers available' },
          `No providers found for "${intent.service_type}" in "${intent.location}". Pipeline terminated.`,
          0
        );
        
        const traceData = traceLogger.getTraces();
        traceLogger.saveToFile();
        
        return {
          success: false,
          requestId,
          intent,
          message: `Sorry, no ${intent.service_type} providers found in ${intent.location} for the requested time. Please try a different time or location.`,
          messageUrdu: `معذرت، ${intent.location} میں ${intent.service_type} فراہم کنندہ دستیاب نہیں۔ براہ کرم دوسرا وقت یا مقام آزمائیں۔`,
          agentTrace: traceData
        };
      }
      
      // ===== STAGE 3: Ranking & Recommendation =====
      console.log('[STAGE 3/5] Ranking providers...');
      const { ranked, recommendation, reasoning } = await this.ranker.rank(providers, intent, traceLogger);
      
      // ===== STAGE 4: Booking Simulation =====
      console.log('[STAGE 4/5] Simulating booking...');
      const booking = await this.bookingAgent.book(recommendation, intent, userId, traceLogger);
      
      // ===== STAGE 5: Follow-Up Scheduling =====
      console.log('[STAGE 5/5] Scheduling follow-ups...');
      const followUps = await this.followUpAgent.scheduleFollowUps(booking, traceLogger);
      
      // Log pipeline completion
      traceLogger.log(
        'Orchestrator',
        'Pipeline Completed',
        { requestId },
        {
          success: true,
          totalSteps: traceLogger.traces.length,
          bookingId: booking.bookingId,
          provider: recommendation.name,
          followUpsScheduled: followUps.length
        },
        `Pipeline completed successfully. Booking ${booking.bookingId} confirmed with ${recommendation.name}. ` +
        `${followUps.length} follow-up actions scheduled. Total pipeline steps: ${traceLogger.traces.length}.`,
        0
      );
      
      // Save trace logs to file
      const traceData = traceLogger.getTraces();
      traceLogger.saveToFile();
      
      console.log('\n' + '='.repeat(60));
      console.log(`[ORCHESTRATOR] Pipeline Complete! Booking: ${booking.bookingId}`);
      console.log('='.repeat(60) + '\n');
      
      return {
        success: true,
        requestId,
        intent: {
          service: intent.service_type,
          location: intent.location,
          time: intent.time_expression,
          urgency: intent.urgency,
          language: intent.language_detected,
          confidence: intent.confidence
        },
        providers: ranked.slice(0, 3).map(p => ({
          rank: p.rank,
          name: p.name,
          nameUrdu: p.nameUrdu,
          service: p.service,
          area: p.location.area,
          distance: p.calculatedDistance + ' km',
          rating: p.rating,
          reviews: p.reviews,
          priceRange: p.priceRange,
          phone: p.phone,
          verified: p.verified,
          score: p.totalScore,
          availableSlots: p.availability.slots
        })),
        recommendation: {
          name: recommendation.name,
          nameUrdu: recommendation.nameUrdu,
          distance: recommendation.calculatedDistance + ' km',
          rating: recommendation.rating,
          score: recommendation.totalScore,
          reasoning: reasoning
        },
        booking: {
          bookingId: booking.bookingId,
          status: booking.status,
          schedule: booking.schedule,
          confirmation: booking.confirmation,
          receipt: booking.receipt
        },
        followUp: {
          totalActions: followUps.length,
          actions: followUps
        },
        agentTrace: traceData
      };
      
    } catch (error) {
      console.error('[ORCHESTRATOR] Pipeline Error:', error);
      
      traceLogger.log(
        'Orchestrator', 'Pipeline Error',
        { requestId, error: error.message },
        { success: false },
        `Pipeline failed with error: ${error.message}`,
        0
      );
      
      const traceData = traceLogger.getTraces();
      traceLogger.saveToFile();
      
      return {
        success: false,
        requestId,
        error: error.message,
        agentTrace: traceData
      };
    }
  }
}

module.exports = Orchestrator;
