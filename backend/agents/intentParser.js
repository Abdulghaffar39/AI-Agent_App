/**
 * Agent 1: Intent Parser
 * Uses Google Gemini API to understand natural language service requests
 * Supports: English, Urdu, Roman Urdu
 */
const { GoogleGenAI } = require('@google/genai');

class IntentParser {
  constructor(apiKey) {
    this.ai = new GoogleGenAI({ apiKey });
    this.modelId = 'gemini-2.5-flash';
    this.name = 'IntentParser';
  }

  async parse(userMessage, traceLogger) {
    const startTime = Date.now();
    
    const prompt = `You are a smart service request parser for Pakistan's informal economy.
Your job is to extract structured information from user messages that may be in English, Urdu, or Roman Urdu (Urdu written in English letters).

Common service types in Pakistan:
- AC Technician / AC repair / AC ki marammat
- Plumber / plumber / nalkay wala
- Electrician / bijli wala / electrician
- Tutor / tuition teacher / teacher
- Beautician / beauty parlor / makeup artist
- Carpenter / mistri / carpenter
- Painter / paint wala / painter
- Home Cleaning / safai / cleaning
- Mechanic / car mechanic / gari wala
- Pest Control / keeron ka spray
- CCTV Installation / camera lagwana
- Movers & Packers / shifting
- Welder / welding wala
- IT Support / computer repair
- Gardener / mali / garden wala
- Tailor / darzi / silai
- Solar Installation / solar panel
- Appliance Repair / machine ki marammat

Location areas in Islamabad: F-5 to F-11, G-5 to G-15, H-8 to H-13, I-8 to I-11, Blue Area, Saddar, Bahria Town, DHA, PWD, Rawalpindi

Time expressions:
- "kal" = tomorrow, "aaj" = today, "abhi" = now, "parso" = day after tomorrow
- "subah" = morning, "dopahar" = afternoon, "shaam" = evening, "raat" = night

Extract from this message: "${userMessage}"

You MUST respond ONLY with valid JSON (no markdown, no backticks):
{
  "service_type": "exact service name from list above",
  "location": "area/sector name",
  "time_expression": "original time words from message",
  "urgency": "low/medium/high",
  "language_detected": "english/urdu/roman_urdu",
  "original_message": "the original message",
  "confidence": 0.0 to 1.0
}`;

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: prompt,
      });

      let text = response.text.trim();
      // Clean markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const parsed = JSON.parse(text);
      const duration = Date.now() - startTime;
      
      traceLogger.log(
        this.name,
        'Parse User Intent',
        { userMessage },
        parsed,
        `Detected language: ${parsed.language_detected}. Extracted service: ${parsed.service_type}, location: ${parsed.location}, time: ${parsed.time_expression}. Confidence: ${parsed.confidence}`,
        duration
      );
      
      return parsed;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('[IntentParser] Error:', error.message);
      
      // Fallback: basic keyword extraction
      const fallback = this.fallbackParse(userMessage);
      
      traceLogger.log(
        this.name,
        'Parse User Intent (Fallback)',
        { userMessage, error: error.message },
        fallback,
        `Gemini API failed, using keyword-based fallback parser. Extracted: ${fallback.service_type} at ${fallback.location}`,
        duration
      );
      
      return fallback;
    }
  }

  // Fallback parser using keyword matching (no API needed)
  fallbackParse(message) {
    const lower = message.toLowerCase();
    
    // Service detection
    const serviceMap = {
      'ac': 'AC Technician', 'air conditioner': 'AC Technician', 'ac technician': 'AC Technician',
      'plumb': 'Plumber', 'nalkay': 'Plumber', 'pani': 'Plumber',
      'electric': 'Electrician', 'bijli': 'Electrician', 'wiring': 'Electrician',
      'tutor': 'Tutor', 'tuition': 'Tutor', 'teacher': 'Tutor', 'padhai': 'Tutor',
      'beauty': 'Beautician', 'makeup': 'Beautician', 'parlor': 'Beautician', 'parlour': 'Beautician',
      'carpenter': 'Carpenter', 'mistri': 'Carpenter', 'lakri': 'Carpenter', 'furniture': 'Carpenter',
      'paint': 'Painter', 'rang': 'Painter',
      'clean': 'Home Cleaning', 'safai': 'Home Cleaning',
      'mechanic': 'Mechanic', 'car': 'Mechanic', 'gari': 'Mechanic',
      'pest': 'Pest Control', 'keeron': 'Pest Control', 'cockroach': 'Pest Control',
      'cctv': 'CCTV Installation', 'camera': 'CCTV Installation',
      'shift': 'Movers & Packers', 'mover': 'Movers & Packers', 'packer': 'Movers & Packers',
      'weld': 'Welder', 'grill': 'Welder',
      'computer': 'IT Support', 'laptop': 'IT Support', 'it ': 'IT Support',
      'garden': 'Gardener', 'mali': 'Gardener', 'grass': 'Gardener',
      'tailor': 'Tailor', 'darzi': 'Tailor', 'silai': 'Tailor', 'stitch': 'Tailor',
      'solar': 'Solar Installation',
      'appliance': 'Appliance Repair', 'washing machine': 'Appliance Repair', 'fridge': 'Appliance Repair'
    };
    
    let serviceType = 'General Service';
    for (const [keyword, service] of Object.entries(serviceMap)) {
      if (lower.includes(keyword)) {
        serviceType = service;
        break;
      }
    }
    
    // Location detection
    const locationMatch = lower.match(/[fghi]-?\d{1,2}|blue area|saddar|bahria|dha|pwd|rawalpindi/i);
    const location = locationMatch ? locationMatch[0].toUpperCase() : 'G-13';
    
    // Urgency
    let urgency = 'medium';
    if (lower.includes('urgent') || lower.includes('jaldi') || lower.includes('abhi') || lower.includes('فوری')) {
      urgency = 'high';
    }
    
    return {
      service_type: serviceType,
      location: location,
      time_expression: lower.includes('kal') ? 'kal subah' : 'today',
      urgency: urgency,
      language_detected: 'roman_urdu',
      original_message: message,
      confidence: 0.6
    };
  }
}

module.exports = IntentParser;
