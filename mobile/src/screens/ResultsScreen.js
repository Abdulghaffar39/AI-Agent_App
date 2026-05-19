import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ResultsScreen({ route, navigation }) {
  const { result } = route.params;
  const { intent, providers, recommendation, booking, followUp } = result;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Intent Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="brain-outline" size={18} color={COLORS.primary} /> Service Request
        </Text>
        <View style={styles.intentRow}>
          <Text style={styles.intentLabel}>Service:</Text>
          <Text style={styles.intentValue}>{intent.service}</Text>
        </View>
        <View style={styles.intentRow}>
          <Text style={styles.intentLabel}>Location:</Text>
          <Text style={styles.intentValue}>
            <Ionicons name="location-outline" size={14} color={COLORS.primary} /> {intent.location}
          </Text>
        </View>
        <View style={styles.intentRow}>
          <Text style={styles.intentLabel}>Time:</Text>
          <Text style={styles.intentValue}>
            <Ionicons name="time-outline" size={14} color={COLORS.primary} /> {intent.time}
          </Text>
        </View>
        <View style={styles.intentRow}>
          <Text style={styles.intentLabel}>Language:</Text>
          <Text style={styles.intentValue}>{intent.language}</Text>
        </View>
        <View style={styles.intentRow}>
          <Text style={styles.intentLabel}>Confidence:</Text>
          <View style={styles.confidenceBar}>
            <View style={[styles.confidenceFill, { width: `${(intent.confidence || 0.9) * 100}%` }]} />
          </View>
          <Text style={styles.intentValue}>{Math.round((intent.confidence || 0.9) * 100)}%</Text>
        </View>
      </View>

      {/* Recommended Provider */}
      <View style={styles.recommendedCard}>
        <Text style={styles.recommendedBadge}>
          <Ionicons name="star" size={12} color={COLORS.primary} /> TOP RECOMMENDATION
        </Text>
        <Text style={styles.recommendedName}>{recommendation.name}</Text>
        {recommendation.nameUrdu && (
          <Text style={styles.recommendedNameUrdu}>{recommendation.nameUrdu}</Text>
        )}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{recommendation.distance}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              <Ionicons name="star" size={16} color={COLORS.star} /> {recommendation.rating}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{recommendation.score}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
        </View>
        <View style={styles.reasoningBox}>
          <Text style={styles.reasoningTitle}>
            <Ionicons name="hardware-chip-outline" size={14} color={COLORS.accent} /> AI Reasoning:
          </Text>
          <Text style={styles.reasoningText}>{recommendation.reasoning}</Text>
        </View>
      </View>

      {/* Other Providers */}
      {providers && providers.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="list-outline" size={18} color={COLORS.primary} /> Other Providers
          </Text>
          {providers.slice(1).map((p, i) => (
            <View key={i} style={styles.providerItem}>
              <View style={styles.providerHeader}>
                <Text style={styles.providerRank}>#{p.rank}</Text>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{p.name}</Text>
                  <Text style={styles.providerMeta}>
                    <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} /> {p.area} • {p.distance} • <Ionicons name="star" size={12} color={COLORS.star} /> {p.rating} ({p.reviews})
                  </Text>
                  <Text style={styles.providerPrice}>💰 {p.priceRange}</Text>
                </View>
              </View>
              {p.verified && (
                <Text style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle-outline" size={12} color={COLORS.accent} /> Verified
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Booking Confirmation */}
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => navigation.navigate('Booking', { booking })}
      >
        <Text style={styles.bookingTitle}>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.accent} /> Booking Confirmed!
        </Text>
        <Text style={styles.bookingId}>ID: {booking.bookingId}</Text>
        <View style={styles.bookingDetails}>
          <Text style={styles.bookingDetail}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textPrimary} /> {booking.schedule.displayDate}
          </Text>
          <Text style={styles.bookingDetail}>
            <Ionicons name="time-outline" size={14} color={COLORS.textPrimary} /> {booking.schedule.timeSlot}
          </Text>
          <Text style={styles.bookingDetail}>
            <Ionicons name="hourglass-outline" size={14} color={COLORS.textPrimary} /> {booking.schedule.estimatedDuration}
          </Text>
        </View>
        <Text style={styles.tapHint}>Tap to view full booking details →</Text>
      </TouchableOpacity>

      {/* Follow-up Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="notifications-outline" size={18} color={COLORS.primary} /> Scheduled Follow-ups ({followUp.totalActions})
        </Text>
        {followUp.actions.map((action, i) => (
          <View key={i} style={styles.followUpItem}>
            <View style={styles.followUpIcon}>
              <Ionicons
                name={
                  action.type === 'reminder'
                    ? 'time-outline'
                    : action.type === 'completion'
                    ? 'checkmark-done-outline'
                    : action.type === 'payment'
                    ? 'cash-outline'
                    : 'chatbubble-ellipses-outline'
                }
                size={18}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.followUpContent}>
              <Text style={styles.followUpType}>{action.type.replace('_', ' ').toUpperCase()}</Text>
              <Text style={styles.followUpTiming}>{action.timing}</Text>
              <Text style={styles.followUpChannel}>Via: {action.channel}</Text>
            </View>
            <View style={[styles.followUpStatus, { backgroundColor: 'rgba(0,217,166,0.15)' }]}>
              <Text style={{ color: COLORS.accent, fontSize: 10, fontWeight: '600' }}>SCHEDULED</Text>
            </View>
          </View>
        ))}
      </View>

      {/* View Trace Logs Button */}
      <TouchableOpacity
        style={styles.traceButton}
        onPress={() => navigation.navigate('Trace', { trace: result.agentTrace })}
      >
        <Text style={styles.traceButtonText}>
          <Ionicons name="analytics-outline" size={16} color={COLORS.primary} /> View Agent Trace Logs
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 16, paddingBottom: 40 },
  
  card: {
    backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(108,99,255,0.15)',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  
  intentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  intentLabel: { color: COLORS.textMuted, fontSize: 13, width: 90, fontWeight: '500' },
  intentValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', flex: 1 },
  confidenceBar: { flex: 1, height: 6, backgroundColor: COLORS.bgCardLight, borderRadius: 3, marginRight: 8 },
  confidenceFill: { height: 6, backgroundColor: COLORS.accent, borderRadius: 3 },
  
  recommendedCard: {
    backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 20, marginBottom: 14,
    borderWidth: 2, borderColor: COLORS.primary,
  },
  recommendedBadge: {
    color: COLORS.primary, fontSize: 11, fontWeight: '800',
    letterSpacing: 1.5, marginBottom: 8,
  },
  recommendedName: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  recommendedNameUrdu: { fontSize: 16, color: COLORS.primary, marginTop: 2, textAlign: 'right' },
  statsRow: { flexDirection: 'row', marginTop: 16, justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  reasoningBox: {
    backgroundColor: COLORS.bgCardLight, borderRadius: 12, padding: 14, marginTop: 16,
  },
  reasoningTitle: { fontSize: 13, fontWeight: '700', color: COLORS.accent, marginBottom: 6 },
  reasoningText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  
  providerItem: {
    backgroundColor: COLORS.bgCardLight, borderRadius: 12, padding: 14, marginBottom: 8,
  },
  providerHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  providerRank: { fontSize: 20, fontWeight: '800', color: COLORS.textMuted, marginRight: 12, width: 30 },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  providerMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  providerPrice: { fontSize: 12, color: COLORS.accent, marginTop: 2, fontWeight: '600' },
  verifiedBadge: { color: COLORS.accent, fontSize: 11, fontWeight: '700', marginTop: 6 },
  
  bookingCard: {
    backgroundColor: 'rgba(0,217,166,0.08)', borderRadius: 18, padding: 20, marginBottom: 14,
    borderWidth: 1.5, borderColor: 'rgba(0,217,166,0.3)',
  },
  bookingTitle: { fontSize: 20, fontWeight: '800', color: COLORS.accent },
  bookingId: { fontSize: 13, color: COLORS.textMuted, marginTop: 4, fontWeight: '600' },
  bookingDetails: { marginTop: 12 },
  bookingDetail: { fontSize: 14, color: COLORS.textPrimary, marginBottom: 4, fontWeight: '500' },
  tapHint: { color: COLORS.textMuted, fontSize: 11, marginTop: 12, fontStyle: 'italic' },
  
  followUpItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCardLight, borderRadius: 10, padding: 12, marginBottom: 8,
  },
  followUpIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.bgDark, alignItems: 'center', justifyContent: 'center' },
  followUpEmoji: { fontSize: 18 },
  followUpContent: { flex: 1, marginLeft: 12 },
  followUpType: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: 0.5 },
  followUpTiming: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  followUpChannel: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  followUpStatus: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  
  traceButton: {
    backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(108,99,255,0.3)', marginBottom: 20,
  },
  traceButtonText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
});
