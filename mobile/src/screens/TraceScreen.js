import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TraceScreen({ route }) {
  const { trace } = route.params || {};
  
  if (!trace) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>No trace data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <Ionicons name="analytics-outline" size={22} color={COLORS.textPrimary} /> Agent Trace Logs
        </Text>
        <Text style={styles.subtitle}>Request: {trace.requestId?.slice(0, 8)}...</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{trace.totalSteps}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{trace.totalDurationMs}ms</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>
      </View>

      {/* Pipeline Steps */}
      {trace.pipeline?.map((step, i) => (
        <View key={i} style={styles.stepCard}>
          {/* Step Header */}
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>{step.stepNumber}</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.agentName}>{step.agent}</Text>
              <Text style={styles.stepName}>{step.step}</Text>
            </View>
            <Text style={styles.duration}>{step.durationMs}ms</Text>
          </View>

          {/* Timestamp */}
          <Text style={styles.timestamp}>
            {new Date(step.timestamp).toLocaleTimeString()}
          </Text>

          {/* Input */}
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>
              <Ionicons name="download-outline" size={11} color={COLORS.textMuted} /> Input:
            </Text>
            <Text style={styles.dataContent}>
              {JSON.stringify(step.input, null, 2).slice(0, 300)}
            </Text>
          </View>

          {/* Output */}
          <View style={styles.dataSection}>
            <Text style={styles.dataTitle}>
              <Ionicons name="upload-outline" size={11} color={COLORS.textMuted} /> Output:
            </Text>
            <Text style={styles.dataContent}>
              {JSON.stringify(step.output, null, 2).slice(0, 400)}
            </Text>
          </View>

          {/* Reasoning */}
          <View style={styles.reasoningSection}>
            <Text style={styles.reasoningTitle}>
              <Ionicons name="hardware-chip-outline" size={11} color={COLORS.accent} /> Reasoning:
            </Text>
            <Text style={styles.reasoningText}>{step.reasoning}</Text>
          </View>

          {/* Connector */}
          {i < trace.pipeline.length - 1 && (
            <View style={styles.connector}>
              <View style={styles.connectorLine} />
              <Text style={styles.connectorArrow}>▼</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 16, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgDark },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, color: COLORS.textSecondary, marginTop: 12 },
  
  header: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 4, fontFamily: 'monospace' },
  statsRow: { flexDirection: 'row', marginTop: 14, gap: 24 },
  stat: { alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  
  stepCard: {
    backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16,
    marginBottom: 4, borderWidth: 1, borderColor: 'rgba(108,99,255,0.12)',
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center' },
  stepNumberBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  stepNumber: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  stepInfo: { flex: 1, marginLeft: 12 },
  agentName: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  stepName: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  duration: { fontSize: 12, color: COLORS.accent, fontWeight: '700', fontFamily: 'monospace' },
  
  timestamp: { fontSize: 10, color: COLORS.textMuted, marginTop: 8, fontFamily: 'monospace' },
  
  dataSection: {
    backgroundColor: COLORS.bgCardLight, borderRadius: 10, padding: 10, marginTop: 10,
  },
  dataTitle: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 4 },
  dataContent: { fontSize: 11, color: COLORS.textSecondary, fontFamily: 'monospace', lineHeight: 16 },
  
  reasoningSection: {
    backgroundColor: 'rgba(0,217,166,0.06)', borderRadius: 10, padding: 10, marginTop: 10,
    borderWidth: 1, borderColor: 'rgba(0,217,166,0.1)',
  },
  reasoningTitle: { fontSize: 11, fontWeight: '700', color: COLORS.accent, marginBottom: 4 },
  reasoningText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  
  connector: { alignItems: 'center', paddingVertical: 6 },
  connectorLine: { width: 2, height: 12, backgroundColor: 'rgba(108,99,255,0.3)' },
  connectorArrow: { color: COLORS.primary, fontSize: 12, marginTop: -2 },
});
