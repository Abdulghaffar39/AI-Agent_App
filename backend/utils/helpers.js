/**
 * Helper utilities for KaamWala backend
 * - Distance calculation (Haversine formula)
 * - Time parsing for Urdu/English
 * - Location coordinate mapping for Islamabad sectors
 */

// Islamabad sector coordinates (approximate centers)
const SECTOR_COORDINATES = {
  'f-5':  { lat: 33.7350, lng: 73.0800 },
  'f-6':  { lat: 33.7250, lng: 73.0600 },
  'f-7':  { lat: 33.7180, lng: 73.0500 },
  'f-8':  { lat: 33.7100, lng: 73.0400 },
  'f-9':  { lat: 33.7000, lng: 73.0250 },
  'f-10': { lat: 33.6950, lng: 73.0100 },
  'f-11': { lat: 33.6850, lng: 73.0200 },
  'g-5':  { lat: 33.7300, lng: 73.0900 },
  'g-6':  { lat: 33.7200, lng: 73.0700 },
  'g-7':  { lat: 33.7100, lng: 73.0550 },
  'g-8':  { lat: 33.6900, lng: 73.0400 },
  'g-9':  { lat: 33.6750, lng: 73.0050 },
  'g-10': { lat: 33.6700, lng: 73.0000 },
  'g-11': { lat: 33.6600, lng: 72.9950 },
  'g-12': { lat: 33.6461, lng: 72.9870 },
  'g-13': { lat: 33.6380, lng: 72.9780 },
  'g-14': { lat: 33.6300, lng: 72.9700 },
  'g-15': { lat: 33.6200, lng: 72.9600 },
  'h-8':  { lat: 33.6850, lng: 73.0450 },
  'h-9':  { lat: 33.6700, lng: 73.0300 },
  'h-10': { lat: 33.6600, lng: 73.0150 },
  'h-11': { lat: 33.6500, lng: 73.0050 },
  'h-12': { lat: 33.6400, lng: 72.9950 },
  'h-13': { lat: 33.6300, lng: 72.9850 },
  'i-8':  { lat: 33.6500, lng: 73.0500 },
  'i-9':  { lat: 33.6350, lng: 73.0200 },
  'i-10': { lat: 33.6200, lng: 73.0100 },
  'i-11': { lat: 33.6100, lng: 73.0000 },
  'blue area': { lat: 33.7100, lng: 73.0600 },
  'saddar': { lat: 33.5990, lng: 73.0480 },
  'bahria town': { lat: 33.5200, lng: 73.0900 },
  'dha': { lat: 33.5400, lng: 73.1100 },
  'pwd': { lat: 33.5700, lng: 73.0600 },
  'rawalpindi': { lat: 33.5651, lng: 73.0169 }
};

/**
 * Calculate distance between two points using Haversine formula
 * @returns distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Get coordinates for a location string
 */
function getCoordinates(locationStr) {
  if (!locationStr) return null;
  const normalized = locationStr.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Direct match
  if (SECTOR_COORDINATES[normalized]) {
    return SECTOR_COORDINATES[normalized];
  }
  
  // Try with/without hyphen
  const withHyphen = normalized.replace(/([a-z])[\s-]*(\d+)/i, '$1-$2');
  if (SECTOR_COORDINATES[withHyphen]) {
    return SECTOR_COORDINATES[withHyphen];
  }
  
  // Partial match
  for (const [key, coords] of Object.entries(SECTOR_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }
  
  // Default to G-13 center if unknown
  return SECTOR_COORDINATES['g-13'];
}

/**
 * Parse time expressions (English/Urdu/Roman Urdu) into structured time
 */
function parseTimeExpression(timeStr) {
  if (!timeStr) {
    return { date: 'today', timeSlot: 'morning', displayTime: 'Today, Morning' };
  }
  
  const lower = timeStr.toLowerCase();
  let date = 'today';
  let timeSlot = 'morning';
  
  // Date detection
  if (lower.includes('kal') || lower.includes('tomorrow') || lower.includes('کل')) {
    date = 'tomorrow';
  } else if (lower.includes('parso') || lower.includes('day after') || lower.includes('پرسوں')) {
    date = 'day_after_tomorrow';
  } else if (lower.includes('aaj') || lower.includes('today') || lower.includes('آج') || lower.includes('abhi')) {
    date = 'today';
  }
  
  // Time slot detection
  if (lower.includes('subah') || lower.includes('morning') || lower.includes('صبح')) {
    timeSlot = 'morning';
  } else if (lower.includes('dopahar') || lower.includes('afternoon') || lower.includes('دوپہر') || lower.includes('lunch')) {
    timeSlot = 'afternoon';
  } else if (lower.includes('shaam') || lower.includes('evening') || lower.includes('شام')) {
    timeSlot = 'evening';
  } else if (lower.includes('raat') || lower.includes('night') || lower.includes('رات')) {
    timeSlot = 'night';
  }
  
  // Map to display
  const dateMap = { today: 'Today', tomorrow: 'Tomorrow', day_after_tomorrow: 'Day After Tomorrow' };
  const slotMap = { morning: 'Morning (8-12)', afternoon: 'Afternoon (12-4)', evening: 'Evening (4-8)', night: 'Night (8-11)' };
  
  return {
    date,
    timeSlot,
    displayTime: `${dateMap[date] || date}, ${slotMap[timeSlot] || timeSlot}`
  };
}

/**
 * Get available time slots based on time preference
 */
function getSlotForTimePreference(slots, timeSlot) {
  const morningSlots = slots.filter(s => {
    const hour = parseInt(s.split(':')[0]);
    const isPM = s.includes('PM');
    const h24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
    return h24 >= 8 && h24 < 12;
  });
  
  const afternoonSlots = slots.filter(s => {
    const hour = parseInt(s.split(':')[0]);
    const isPM = s.includes('PM');
    const h24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
    return h24 >= 12 && h24 < 16;
  });
  
  const eveningSlots = slots.filter(s => {
    const hour = parseInt(s.split(':')[0]);
    const isPM = s.includes('PM');
    const h24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
    return h24 >= 16 && h24 < 20;
  });
  
  switch (timeSlot) {
    case 'morning': return morningSlots.length > 0 ? morningSlots[0] : slots[0];
    case 'afternoon': return afternoonSlots.length > 0 ? afternoonSlots[0] : slots[0];
    case 'evening': return eveningSlots.length > 0 ? eveningSlots[0] : slots[slots.length - 1];
    default: return slots[0];
  }
}

/**
 * Generate a unique booking ID
 */
function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BK-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = {
  calculateDistance,
  getCoordinates,
  parseTimeExpression,
  getSlotForTimePreference,
  generateBookingId,
  SECTOR_COORDINATES
};
