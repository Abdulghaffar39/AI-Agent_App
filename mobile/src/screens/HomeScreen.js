import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Animated, Dimensions, KeyboardAvoidingView, Platform
} from 'react-native';
import { COLORS, API_BASE_URL } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PIPELINE_STEPS = [
  { icon: 'brain-outline', label: 'Understanding Request', labelUrdu: 'درخواست سمجھ رہے ہیں' },
  { icon: 'search-outline', label: 'Finding Providers', labelUrdu: 'فراہم کنندہ تلاش کر رہے ہیں' },
  { icon: 'git-compare-outline', label: 'Ranking & Matching', labelUrdu: 'درجہ بندی کر رہے ہیں' },
  { icon: 'calendar-outline', label: 'Booking Service', labelUrdu: 'بکنگ کر رہے ہیں' },
  { icon: 'notifications-outline', label: 'Setting Reminders', labelUrdu: 'یاد دہانی ترتیب دے رہے ہیں' },
];

const EXAMPLE_QUERIES = [
  'Mujhe kal subah G-13 mein AC technician chahiye',
  'I need a plumber in F-8 today',
  'G-11 mein electrician chahiye urgent',
  'Beautician chahiye G-13 mein kal shaam',
  'مجھے کل صبح ٹیوٹر چاہیے G-10 میں',
  'Carpenter needed in I-10 tomorrow',
];

export default function HomeScreen({ navigation }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [loading]);

  const simulateSteps = () => {
    return new Promise((resolve) => {
      let step = 0;
      const interval = setInterval(() => {
        setCurrentStep(step);
        step++;
        if (step >= PIPELINE_STEPS.length) {
          clearInterval(interval);
          resolve();
        }
      }, 600);
    });
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setCurrentStep(0);

    try {
      // Start step animation
      const stepPromise = simulateSteps();
      
      const response = await fetch(`${API_BASE_URL}/api/service-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), userId: 'mobile_user_1' }),
      });

      await stepPromise;
      const data = await response.json();

      if (data.success) {
        setCurrentStep(PIPELINE_STEPS.length);
        setTimeout(() => {
          navigation.navigate('Results', { result: data });
          setLoading(false);
          setCurrentStep(-1);
        }, 500);
      } else {
        setError(data.message || data.error || 'Something went wrong');
        setLoading(false);
        setCurrentStep(-1);
      }
    } catch (err) {
      setError(`Cannot connect to server. Make sure backend is running at ${API_BASE_URL}`);
      setLoading(false);
      setCurrentStep(-1);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Ionicons name="construct-outline" size={54} color={COLORS.primary} style={{ marginBottom: 12 }} />
          <Text style={styles.title}>KaamWala</Text>
          <Text style={styles.titleUrdu}>کام والا</Text>
          <Text style={styles.subtitle}>AI-Powered Service Booking</Text>
          <Text style={styles.subtitleUrdu}>ذہین سروس بکنگ سسٹم</Text>
        </Animated.View>

        {/* Input Area */}
        <Animated.View style={[styles.inputCard, { opacity: fadeAnim, transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.inputLabel}>What service do you need?</Text>
          <Text style={styles.inputLabelUrdu}>آپ کو کون سی سروس چاہیے؟</Text>
          
          <TextInput
            style={styles.input}
            placeholder="e.g., Mujhe kal subah G-13 mein AC technician chahiye"
            placeholderTextColor={COLORS.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!loading}
          />
          
          <TouchableOpacity
            style={[styles.submitButton, (!message.trim() || loading) && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={!message.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>
                <Ionicons name="rocket-outline" size={16} color="#FFF" /> Find Service Provider
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Pipeline Progress */}
        {loading && (
          <View style={styles.pipelineCard}>
            <Text style={styles.pipelineTitle}>
              <Ionicons name="hardware-chip-outline" size={18} color={COLORS.primary} /> AI Agent Pipeline
            </Text>
            {PIPELINE_STEPS.map((step, i) => (
              <View key={i} style={[styles.pipelineStep, i <= currentStep && styles.pipelineStepActive]}>
                <View style={[styles.stepDot, i <= currentStep && styles.stepDotActive, i === currentStep && styles.stepDotCurrent]}>
                  {i < currentStep ? (
                    <Text style={styles.stepCheck}>✓</Text>
                  ) : i === currentStep ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Text style={styles.stepNumber}>{i + 1}</Text>
                  )}
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={[styles.stepLabel, i <= currentStep && styles.stepLabelActive]}>
                    <Ionicons name={step.icon} size={15} color={i <= currentStep ? COLORS.primary : COLORS.textMuted} /> {step.label}
                  </Text>
                  <Text style={styles.stepLabelUrdu}>{step.labelUrdu}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {/* Example Queries */}
        {!loading && (
          <View style={styles.examplesSection}>
            <Text style={styles.examplesTitle}>
              <Ionicons name="bulb-outline" size={16} color={COLORS.primary} /> Try these examples:
            </Text>
            {EXAMPLE_QUERIES.map((q, i) => (
              <TouchableOpacity key={i} style={styles.exampleChip} onPress={() => setMessage(q)}>
                <Text style={styles.exampleText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Supported Services */}
        {!loading && (
          <View style={styles.servicesGrid}>
            <Text style={styles.servicesTitle}>
              <Ionicons name="home-outline" size={16} color={COLORS.primary} /> Supported Services
            </Text>
            <View style={styles.servicesRow}>
              {['❄️ AC Repair', '🔧 Plumber', '⚡ Electrician', '📚 Tutor', '💇 Beautician', '🪚 Carpenter', '🎨 Painter', '🧹 Cleaning'].map((s, i) => (
                <View key={i} style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 24 },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 36, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 1 },
  titleUrdu: { fontSize: 24, color: COLORS.primary, marginTop: 2, fontWeight: '600' },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
  subtitleUrdu: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  
  inputCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  inputLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  inputLabelUrdu: { fontSize: 13, color: COLORS.textMuted, marginBottom: 12, textAlign: 'right' },
  input: {
    backgroundColor: COLORS.bgCardLight,
    borderRadius: 14,
    padding: 16,
    color: COLORS.textPrimary,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.15)',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  
  pipelineCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  pipelineTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  pipelineStep: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  pipelineStepActive: {},
  stepDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.bgCardLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.textMuted,
  },
  stepDotActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(0,217,166,0.1)' },
  stepDotCurrent: { borderColor: COLORS.primary, backgroundColor: 'rgba(108,99,255,0.15)' },
  stepCheck: { color: COLORS.accent, fontSize: 16, fontWeight: '700' },
  stepNumber: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  stepTextContainer: { marginLeft: 12, flex: 1 },
  stepLabel: { color: COLORS.textMuted, fontSize: 14, fontWeight: '500' },
  stepLabelActive: { color: COLORS.textPrimary },
  stepLabelUrdu: { color: COLORS.textMuted, fontSize: 11, marginTop: 1, textAlign: 'right' },
  
  errorCard: {
    backgroundColor: 'rgba(255,82,82,0.1)',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,82,82,0.3)',
  },
  errorText: { color: COLORS.error, fontSize: 13 },
  
  examplesSection: { marginTop: 24 },
  examplesTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  exampleChip: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.15)',
  },
  exampleText: { color: COLORS.textSecondary, fontSize: 13 },
  
  servicesGrid: { marginTop: 24 },
  servicesTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceTag: {
    backgroundColor: COLORS.bgCardLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  serviceTagText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '500' },
});
