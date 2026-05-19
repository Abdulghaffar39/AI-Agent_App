/**
 * Agent 3: Ranker & Recommender
 * Scores and ranks providers using weighted criteria
 * Provides clear reasoning for selection
 */

class Ranker {
  constructor() {
    this.name = 'Ranker';
    // Scoring weights
    this.weights = {
      distance: 0.35,    // 35% - closer is better
      rating: 0.30,      // 30% - higher rating is better
      reviews: 0.15,     // 15% - more reviews = more trusted
      verified: 0.10,    // 10% - verified providers preferred
      availability: 0.10 // 10% - more slots = more flexible
    };
  }

  async rank(providers, intent, traceLogger) {
    const startTime = Date.now();
    
    if (!providers || providers.length === 0) {
      traceLogger.log(this.name, 'Rank Providers', { providers: [] }, { ranked: [] },
        'No providers to rank. Search returned empty results.', Date.now() - startTime);
      return [];
    }
    
    // Calculate scores for each provider
    const scored = providers.map(provider => {
      const scores = this.calculateScores(provider, providers);
      const totalScore = Object.entries(scores).reduce((sum, [key, val]) => {
        return sum + (val * this.weights[key]);
      }, 0);
      
      return {
        ...provider,
        scores,
        totalScore: Math.round(totalScore * 100) / 100,
        rank: 0 // will be set after sorting
      };
    });
    
    // Sort by total score descending
    scored.sort((a, b) => b.totalScore - a.totalScore);
    
    // Assign ranks
    scored.forEach((p, i) => { p.rank = i + 1; });
    
    // Generate reasoning for top pick
    const topPick = scored[0];
    const reasoning = this.generateReasoning(topPick, scored);
    
    const duration = Date.now() - startTime;
    
    traceLogger.log(
      this.name,
      'Rank & Recommend Providers',
      {
        providersCount: providers.length,
        weights: this.weights,
        serviceType: intent.service_type
      },
      {
        rankings: scored.map(p => ({
          rank: p.rank,
          name: p.name,
          totalScore: p.totalScore,
          distance: p.calculatedDistance + ' km',
          rating: p.rating,
          scores: p.scores
        })),
        recommendation: topPick.name,
        reasoning: reasoning
      },
      reasoning,
      duration
    );
    
    return { ranked: scored, recommendation: topPick, reasoning };
  }

  calculateScores(provider, allProviders) {
    // Distance score: inverse - closer is better (0-1)
    const maxDist = Math.max(...allProviders.map(p => p.calculatedDistance), 1);
    const distanceScore = 1 - (provider.calculatedDistance / maxDist);
    
    // Rating score: normalized to 0-1
    const ratingScore = provider.rating / 5.0;
    
    // Reviews score: log-normalized
    const maxReviews = Math.max(...allProviders.map(p => p.reviews), 1);
    const reviewsScore = Math.log(provider.reviews + 1) / Math.log(maxReviews + 1);
    
    // Verified bonus
    const verifiedScore = provider.verified ? 1.0 : 0.0;
    
    // Availability score: more slots = more flexible
    const maxSlots = Math.max(...allProviders.map(p => p.availability.slots.length), 1);
    const availabilityScore = provider.availability.slots.length / maxSlots;
    
    return {
      distance: Math.round(distanceScore * 100) / 100,
      rating: Math.round(ratingScore * 100) / 100,
      reviews: Math.round(reviewsScore * 100) / 100,
      verified: verifiedScore,
      availability: Math.round(availabilityScore * 100) / 100
    };
  }

  generateReasoning(topPick, allRanked) {
    const reasons = [];
    
    reasons.push(`Selected "${topPick.name}" as the top recommendation with a score of ${topPick.totalScore}/1.00.`);
    
    if (topPick.calculatedDistance <= 2) {
      reasons.push(`Very close proximity at only ${topPick.calculatedDistance} km from your location.`);
    } else {
      reasons.push(`Located ${topPick.calculatedDistance} km from your location in ${topPick.location.area}.`);
    }
    
    if (topPick.rating >= 4.5) {
      reasons.push(`Excellent rating of ${topPick.rating}/5 based on ${topPick.reviews} reviews.`);
    } else {
      reasons.push(`Good rating of ${topPick.rating}/5 with ${topPick.reviews} reviews.`);
    }
    
    if (topPick.verified) {
      reasons.push(`This is a verified provider with ${topPick.experience} of experience.`);
    }
    
    reasons.push(`${topPick.availability.slots.length} time slots available. Price range: ${topPick.priceRange}.`);
    
    if (allRanked.length > 1) {
      reasons.push(`Compared against ${allRanked.length - 1} other providers in the area.`);
    }
    
    return reasons.join(' ');
  }
}

module.exports = Ranker;
