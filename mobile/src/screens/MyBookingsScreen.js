import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, API_BASE_URL } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        <Ionicons name="list-outline" size={24} color={COLORS.primary} /> My Bookings
      </Text>
      <Text style={styles.subtitle}>{bookings.length} booking(s)</Text>

      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="mail-open-outline" size={56} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>Send a service request to get started!</Text>
        </View>
      ) : (
        bookings.map((b, i) => (
          <View key={i} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.statusDot} />
              <Text style={styles.bookingId}>{b.bookingId}</Text>
              <Text style={styles.bookingStatus}>{b.status?.toUpperCase()}</Text>
            </View>
            <Text style={styles.providerName}>{b.provider?.name}</Text>
            {b.provider?.nameUrdu && (
              <Text style={styles.providerNameUrdu}>{b.provider.nameUrdu}</Text>
            )}
            <View style={styles.detailsRow}>
              <Text style={styles.detail}>
                <Ionicons name="construct-outline" size={13} color={COLORS.textSecondary} /> {b.service?.type}
              </Text>
              <Text style={styles.detail}>
                <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} /> {b.provider?.area}
              </Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detail}>
                <Ionicons name="calendar-outline" size={13} color={COLORS.textSecondary} /> {b.schedule?.displayDate}
              </Text>
              <Text style={styles.detail}>
                <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} /> {b.schedule?.timeSlot}
              </Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detail}>
                <Ionicons name="cash-outline" size={13} color={COLORS.textSecondary} /> {b.provider?.priceRange}
              </Text>
              <Text style={styles.detail}>
                <Ionicons name="call-outline" size={13} color={COLORS.textSecondary} /> {b.provider?.phone}
              </Text>
            </View>
            <Text style={styles.createdAt}>
              Created: {new Date(b.createdAt).toLocaleString()}
            </Text>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={() => { setLoading(true); fetchBookings(); }}>
        <Text style={styles.refreshText}>
          <Ionicons name="refresh-outline" size={14} color={COLORS.primary} /> Refresh
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 16, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgDark },
  loadingText: { color: COLORS.textSecondary, marginTop: 12, fontSize: 14 },
  
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginTop: 8 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginBottom: 20 },
  
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 56 },
  emptyText: { fontSize: 18, fontWeight: '700', color: COLORS.textSecondary, marginTop: 16 },
  emptySubtext: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  
  bookingCard: {
    backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 18,
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(108,99,255,0.15)',
  },
  bookingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent, marginRight: 8 },
  bookingId: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, flex: 1 },
  bookingStatus: { fontSize: 11, fontWeight: '800', color: COLORS.accent, letterSpacing: 1 },
  providerName: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  providerNameUrdu: { fontSize: 14, color: COLORS.primary, textAlign: 'right', marginTop: 2 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  detail: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  createdAt: { fontSize: 11, color: COLORS.textMuted, marginTop: 12, fontStyle: 'italic' },
  
  refreshButton: {
    backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(108,99,255,0.2)', marginTop: 8,
  },
  refreshText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
});
