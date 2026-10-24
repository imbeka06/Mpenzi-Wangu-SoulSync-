import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar, Heart, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function CycleScreen({ coupleId }: { coupleId: string }) {
  const { colors } = useTheme();
  const [dayOfCycle] = useState(12);
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
    Alert.alert('Mwezi Care Synced 💕', `Cycle status synced for couple space '${coupleId}'!`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.headerCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
          <Calendar color={colors.headerText} size={32} />
        </View>
        <Text style={[styles.title, { color: colors.headerText }]}>Mwezi Care Calendar 🌸</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Cycle Tracking & Partner Care</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={[styles.phaseTag, { color: colors.primary }]}>Day {dayOfCycle} of {cycleLength}</Text>
            <Text style={[styles.phaseName, { color: colors.subText }]}>{currentPhase}</Text>
          </View>
          <View style={[styles.progressBarBackground, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${(dayOfCycle / cycleLength) * 100}%` }]} />
          </View>
        </View>
      </View>

      <View style={[styles.tipCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <View style={styles.tipHeader}>
          <Heart color={colors.primary} size={20} fill={colors.primary} />
          <Text style={[styles.tipTitle, { color: colors.inputText }]}>Partner Empathy Tip</Text>
        </View>
        <Text style={[styles.tipText, { color: colors.subText }]}>
          "Energy levels are rising! Great time for outdoor dates or planning fun activities together 💕"
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Sparkles color={colors.headerText} size={18} />
          <Text style={[styles.sectionTitle, { color: colors.inputText }]}>Log Today's Symptoms</Text>
        </View>

        <View style={styles.symptomGrid}>
          {symptomOptions.map((item, index) => {
            const isSelected = selectedSymptoms.includes(item);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.symptomChip,
                  { backgroundColor: isSelected ? colors.primary : colors.cardBg, borderColor: isSelected ? colors.primary : colors.border },
                ]}
                onPress={() => toggleSymptom(item)}
              >
                <Text style={{ fontSize: 13, fontWeight: isSelected ? '700' : '600', color: isSelected ? '#FFF' : colors.inputText }}>
                  {item}
                </Text>
                {isSelected && <CheckCircle2 color="#FFF" size={16} style={{ marginLeft: 6 }} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={[styles.syncBtn, { backgroundColor: colors.primary }]} onPress={handleSyncCycle}>
        <Text style={styles.syncBtnText}>Update & Sync With Partner 💕</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  headerCard: { padding: 20, borderRadius: 24, alignItems: 'center', borderWidth: 1 },
  iconCircle: { padding: 14, borderRadius: 50, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2, marginBottom: 15 },
  progressContainer: { width: '100%', marginTop: 10 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  phaseTag: { fontSize: 13, fontWeight: '800' },
  phaseName: { fontSize: 13, fontWeight: '600' },
  progressBarBackground: { height: 10, borderRadius: 5, overflow: 'hidden', borderWidth: 1 },
  progressBarFill: { height: '100%', borderRadius: 5 },
  tipCard: { padding: 18, borderRadius: 20, marginTop: 20, borderWidth: 1, gap: 8 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipTitle: { fontSize: 15, fontWeight: '700' },
  tipText: { fontSize: 13, fontStyle: 'italic', lineHeight: 19 },
  section: { marginTop: 25 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  symptomChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  syncBtn: { padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 30 },
  syncBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});