import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BilanResult } from '@/features/bilan/api/bilanApi';
import Colors from '@/themes/colors';

type Props = {
  bilan: BilanResult;
  onPress: () => void;
};

export default function BilanSummaryCard({ bilan, onPress }: Props) {
  const strengths = bilan.conclusion.keyStrengths.slice(0, 3);
  const jobs = bilan.conclusion.recommendedJobs.slice(0, 2);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bilan de compétences</Text>

      <Text style={styles.label}>{bilan.conclusion.archetype.title}</Text>

      {/* Strengths */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Forces clés</Text>

        <View style={styles.badges}>
          {strengths.length === 0 && (
            <Text style={styles.placeholder}>À explorer dans ton bilan</Text>
          )}

          {strengths.map((s) => (
            <View key={s} style={styles.badge}>
              <Text style={styles.badgeText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Jobs */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Pistes métiers</Text>

        <View style={styles.badges}>
          {jobs.length === 0 && (
            <Text style={styles.placeholder}>Suggestions dans ton bilan</Text>
          )}

          {jobs.map((job) => (
            <View key={job.id} style={styles.badgeLight}>
              <Text style={styles.badgeLightText}>{job.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Voir mon bilan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffffdd',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 16,
    color: '#062314',
    opacity: 0.7,
    marginBottom: 6,
  },

  label: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.orange.normal,
    marginBottom: 4,
  },

  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '600',
    marginBottom: 6,
  },

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  badge: {
    backgroundColor: Colors.greenLight.light.normal,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.greenLight.dark.normal,
  },

  badgeLight: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeLightText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.greyDark.normal,
  },

  placeholder: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.45)',
    fontStyle: 'italic',
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});
