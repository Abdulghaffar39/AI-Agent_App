import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function BookingScreen({ route }) {
  const { booking } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Header */}
      <View style={styles.successHeader}>
        <Ionicons name="checkmark-circle" size={64} color={COLORS.accent} />
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successTitleUrdu}>بکنگ کنفرم ہو گئی!</Text>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{booking.bookingId}</Text>
        </View>
      </View>

      {/* Service Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="construct-outline" size={18} color={COLORS.primary} /> Service Details
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{booking.service.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>✓ CONFIRMED</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Created</Text>
          <Text style={styles.value}>{new Date(booking.createdAt).toLocaleString()}</Text>
        </View>
      </View>

      {/* Provider Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="person-outline" size={18} color={COLORS.primary} /> Provider Details
        </Text>
        <Text style={styles.providerName}>{booking.provider.name}</Text>
        {booking.provider.nameUrdu && (
          <Text style={styles.providerNameUrdu}>{booking.provider.nameUrdu}</Text>
        )}
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>
            <Ionicons name="location-outline" size={14} color={COLORS.textMuted} /> Area
          </Text>
          <Text style={styles.value}>{booking.provider.area}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            <Ionicons name="call-outline" size={14} color={COLORS.textMuted} /> Contact
          </Text>
          <Text style={[styles.value, { color: COLORS.accent }]}>{booking.provider.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            <Ionicons name="star-outline" size={14} color={COLORS.textMuted} /> Rating
          </Text>
          <Text style={styles.value}>{booking.provider.rating}/5</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            <Ionicons name="cash-outline" size={14} color={COLORS.textMuted} /> Price
          </Text>
          <Text style={styles.value}>{booking.provider.priceRange}</Text>
        </View>
      </View>

      {/* Schedule */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="calendar-outline" size={18} color={COLORS.primary} /> Schedule
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{booking.schedule.displayDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time Slot</Text>
          <Text style={[styles.value, { fontWeight: '800', color: COLORS.primary }]}>{booking.schedule.timeSlot}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>{booking.schedule.estimatedDuration}</Text>
        </View>
      </View>

      {/* Confirmation Message */}
      <View style={styles.messageCard}>
        <Text style={styles.cardTitle}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.accent} /> Confirmation Message
        </Text>
        <Text style={styles.messageText}>{booking.confirmation.message}</Text>
        <View style={styles.divider} />
        <Text style={styles.messageTextUrdu}>{booking.confirmation.messageUrdu}</Text>
        <Text style={styles.sentVia}>Sent via: {booking.confirmation.sentVia}</Text>
      </View>

      {/* Receipt */}
      <View style={styles.receiptCard}>
        <Text style={styles.receiptTitle}>
          <Ionicons name="receipt-outline" size={20} color={COLORS.textPrimary} /> Booking Receipt
        </Text>
        <View style={styles.receiptDivider} />
        <View style={styles.row}>
          <Text style={styles.receiptLabel}>Booking ID</Text>
          <Text style={styles.receiptValue}>{booking.receipt.bookingId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.receiptLabel}>Service</Text>
          <Text style={styles.receiptValue}>{booking.receipt.service}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.receiptLabel}>Provider</Text>
          <Text style={styles.receiptValue}>{booking.receipt.provider}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.receiptLabel}>Est. Cost</Text>
          <Text style={[styles.receiptValue, { color: COLORS.accent, fontWeight: '800' }]}>{booking.receipt.estimatedCost}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.receiptLabel}>Payment</Text>
          <Text style={styles.receiptValue}>{booking.receipt.paymentMode}</Text>
        </View>
        <View style={styles.receiptDivider} />
        <Text style={styles.receiptFooter}>
          Thank you for using KaamWala! <Ionicons name="happy-outline" size={14} color={COLORS.textSecondary} />
        </Text>
        <Text style={styles.receiptFooterUrdu}>
          کام والا استعمال کرنے کا شکریہ! <Ionicons name="happy-outline" size={14} color={COLORS.textMuted} />
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 16, paddingBottom: 40 },
  
  successHeader: { alignItems: 'center', paddingVertical: 24 },
  checkmark: { fontSize: 56 },
  successTitle: { fontSize: 24, fontWeight: '800', color: COLORS.accent, marginTop: 10 },
  successTitleUrdu: { fontSize: 18, color: COLORS.textSecondary, marginTop: 4 },
  idBadge: {
    backgroundColor: 'rgba(0,217,166,0.15)', borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 8, marginTop: 12,
  },
  idText: { color: COLORS.accent, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  
  card: {
    backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(108,99,255,0.15)',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },
  value: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 12 },
  divider: { height: 1, backgroundColor: 'rgba(108,99,255,0.1)', marginVertical: 12 },
  
  statusBadge: { backgroundColor: 'rgba(0,217,166,0.15)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { color: COLORS.accent, fontSize: 12, fontWeight: '800' },
  
  providerName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  providerNameUrdu: { fontSize: 16, color: COLORS.primary, marginTop: 2, textAlign: 'right' },
  
  messageCard: {
    backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(0,217,166,0.15)',
  },
  messageText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
  messageTextUrdu: { color: COLORS.textMuted, fontSize: 13, lineHeight: 22, textAlign: 'right' },
  sentVia: { color: COLORS.textMuted, fontSize: 11, marginTop: 8, fontStyle: 'italic' },
  
  receiptCard: {
    backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 20,
    marginBottom: 20, borderWidth: 1.5, borderColor: 'rgba(108,99,255,0.2)',
    borderStyle: 'dashed',
  },
  receiptTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  receiptDivider: { height: 1, backgroundColor: 'rgba(108,99,255,0.2)', marginVertical: 14, borderStyle: 'dashed' },
  receiptLabel: { color: COLORS.textMuted, fontSize: 13 },
  receiptValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  receiptFooter: { textAlign: 'center', color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  receiptFooterUrdu: { textAlign: 'center', color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
});
