import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar, Heart, Sparkles, CheckCircle2 } from 'lucide-react-native';

export default function CycleScreen({ coupleId }: { coupleId: string }) {
  const [dayOfCycle, setDayOfCycle] = useState(12);
  const [cycleLength] = useState(28);
  const [currentPhase] = useState('Follicular Phase');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptomOptions = [
    '🌸 Mild Cramps',
    '☕ Craving Sweets',
    '😴 Low Energy',
    '💖 Feeling Loving',
    '💫 Mood Swings',
    '💆 Headaches',
  ];

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSyncCycle = () => {
    Alert.alert(
      'Mwezi Care Synced 💕',
      `Cycle status and ${selectedSymptoms.length} logged symptoms updated for couple space '${coupleId}'!`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <Calendar color="#D81B60" size={32} />
        </View>
        <Text style={styles.title}>Mwezi Care Calendar 🌸</Text>
        <Text style={styles.subtitle}>Cycle Tracking & Partner Care</Text>

        {/* Phase Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={styles.phaseTag}>Day {dayOfCycle} of {cycleLength}</Text>
            <Text style={styles.phaseName}>{currentPhase}</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(dayOfCycle / cycleLength) * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Partner Empathy Tip Card */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Heart color="#FF6B8B" size={20} fill="#FF6B8B" />
          <Text style={styles.tipTitle}>Partner Empathy Tip</Text>
        </View>
        <Text style={styles.tipText}>
          "Energy levels are rising! Great time for planning fun weekend dates or outdoor activities together 💕"
        </Text>
      </View>

      {/* Symptom & Mood Selector */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Sparkles color="#D81B60" size={18} />
          <Text style={styles.sectionTitle}>Log Today's Feelings & Symptoms</Text>
        </View>

        <View style={styles.symptomGrid}>
          {symptomOptions.map((item, index) => {
            const isSelected = selectedSymptoms.includes(item);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.symptomChip,
                  isSelected && styles.symptomChipSelected,
                ]}
                onPress={() => toggleSymptom(item)}
              >
                <Text
                  style={[
                    styles.symptomText,
                    isSelected && styles.symptomTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {isSelected && (
                  <CheckCircle2 color="#FFFFFF" size={16} style={{ marginLeft: 6 }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Sync Button */}
      <TouchableOpacity style={styles.syncBtn} onPress={handleSyncCycle}>
        <Text style={styles.syncBtnText}>Update & Sync With Partner 💕</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  content: { padding: 20, paddingBottom: 40 },

  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderColor: '#FFD1DC',
    borderWidth: 1,
    shadowColor: '#FFD1DC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    backgroundColor: '#FFF5F7',
    padding: 14,
    borderRadius: 50,
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#D81B60' },
  subtitle: { fontSize: 13, color: '#718096', marginTop: 2, marginBottom: 15 },

  progressContainer: { width: '100%', marginTop: 10 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phaseTag: { fontSize: 13, fontWeight: '800', color: '#FF6B8B' },
  phaseName: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#FFF5F7',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6B8B',
    borderRadius: 5,
  },

  tipCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    marginTop: 20,
    borderColor: '#FFD1DC',
    borderWidth: 1,
    gap: 8,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipTitle: { fontSize: 15, fontWeight: '700', color: '#2D3748' },
  tipText: {
    fontSize: 13,
    color: '#4A5568',
    fontStyle: 'italic',
    lineHeight: 19,
  },

  section: { marginTop: 25 },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#2D3748' },

  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  symptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  symptomChipSelected: {
    backgroundColor: '#FF6B8B',
    borderColor: '#FF6B8B',
  },
  symptomText: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  symptomTextSelected: { color: '#FFFFFF', fontWeight: '700' },

  syncBtn: {
    backgroundColor: '#FF6B8B',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#FF6B8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  syncBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});