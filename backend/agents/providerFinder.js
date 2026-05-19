/**
 * Agent 2: Provider Finder
 * Searches mock database for providers matching the service type and location
 */
const fs = require('fs');
const path = require('path');
const { calculateDistance, getCoordinates } = require('../utils/helpers');

class ProviderFinder {
  constructor() {
    this.name = 'ProviderFinder';
    this.providersPath = path.join(__dirname, '..', 'data', 'providers.json');
  }

  async find(intent, traceLogger) {
    const startTime = Date.now();
    
    // Load providers
    const providers = JSON.parse(fs.readFileSync(this.providersPath, 'utf-8'));
    
    // Get user location coordinates
    const userCoords = getCoordinates(intent.location);
    
    // Filter by service type (fuzzy match)
    const serviceMatches = providers.filter(p => {
      const pService = p.service.toLowerCase();
      const iService = intent.service_type.toLowerCase();
      return pService.includes(iService) || iService.includes(pService) ||
             this.fuzzyMatch(pService, iService);
    });
    
    // Calculate distance for each match
    const withDistance = serviceMatches.map(p => {
      const dist = calculateDistance(
        userCoords.lat, userCoords.lng,
        p.location.lat, p.location.lng
      );
      return { ...p, calculatedDistance: dist };
    });
    
    // Check availability based on time
    const timeDate = intent.time_expression?.toLowerCase() || '';
    const isForTomorrow = timeDate.includes('kal') || timeDate.includes('tomorrow');
    
    const available = withDistance.filter(p => {
      if (isForTomorrow) return p.availability.tomorrow;
      return p.availability.today;
    });
    
    // Sort by distance
    available.sort((a, b) => a.calculatedDistance - b.calculatedDistance);
    
    // Take top 5 nearest
    const topProviders = available.slice(0, 5);
    
    const duration = Date.now() - startTime;
    
    traceLogger.log(
      this.name,
      'Find Matching Providers',
      {
        serviceType: intent.service_type,
        location: intent.location,
        userCoordinates: userCoords,
        totalProviders: providers.length
      },
      {
        serviceMatches: serviceMatches.length,
        availableNow: available.length,
        topProviders: topProviders.map(p => ({
          name: p.name,
          distance: p.calculatedDistance + ' km',
          area: p.location.area,
          rating: p.rating
        }))
      },
      `Found ${serviceMatches.length} providers for "${intent.service_type}". ` +
      `${available.length} are available ${isForTomorrow ? 'tomorrow' : 'today'}. ` +
      `Returning top ${topProviders.length} nearest providers within range. ` +
      `Search centered on ${intent.location} (${userCoords.lat}, ${userCoords.lng}).`,
      duration
    );
    
    return topProviders;
  }

  fuzzyMatch(str1, str2) {
    const keywords1 = str1.split(/\s+/);
    const keywords2 = str2.split(/\s+/);
    return keywords1.some(k1 => keywords2.some(k2 => 
      k1.includes(k2) || k2.includes(k1)
    ));
  }
}

module.exports = ProviderFinder;
