import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BilanResult } from '@/features/bilan/api/bilanApi';
import Colors from '@/themes/colors';
import { displayFontFamily, titleFontFamily } from '@/themes/typography';
import {
  cardSurface,
  neutralBadge,
  neutralBadgeText,
  secondaryButton,
  secondaryButtonText,
  softBadge,
  softBadgeText,
} from '@/themes/ui';

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
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>Voir mon bilan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardSurface,
    padding: 20,
    marginBottom: 28,
  },

  title: {
    fontSize: 16,
    fontFamily: titleFontFamily,
    color: '#1F1F1F',
    opacity: 0.7,
    marginBottom: 6,
  },

  label: {
    fontSize: 30,
    fontWeight: '600',
    fontFamily: displayFontFamily,
    color: Colors.accent.strong,
    marginBottom: 4,
  },

  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.82)',
    fontWeight: '600',
    marginBottom: 6,
  },

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  badge: {
    ...softBadge,
  },
  badgeText: {
    ...softBadgeText,
  },

  badgeLight: {
    ...neutralBadge,
  },
  badgeLightText: {
    ...neutralBadgeText,
  },

  placeholder: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.68)',
    fontStyle: 'italic',
  },

  button: {
    ...secondaryButton,
    marginTop: 10,
  },
  buttonText: {
    ...secondaryButtonText,
  },
});
