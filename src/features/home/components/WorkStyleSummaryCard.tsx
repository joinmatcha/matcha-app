import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { WorkStyleResult } from '@/features/workStyle/api/workStyleApi';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  displayFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { cardSurface } from '@/themes/ui';

type Props = {
  result: WorkStyleResult;
  onPress: () => void;
};

export default function WorkStyleSummaryCard({ result, onPress }: Props) {
  const axes = result.topAxisLabels.slice(0, 3);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Style professionnel</Text>
          <Text style={styles.title}>{result.profile.title}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {result.profile.description}
      </Text>

      <View style={styles.axesRow}>
        {axes.map((axis) => (
          <View key={axis} style={styles.axisPill}>
            <Text style={styles.axisText}>{axis}</Text>
          </View>
        ))}
      </View>

      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>Utilisé dans tes métiers</Text>
        <Text style={styles.insightText}>
          Ce résultat complète ton auto-évaluation et ton profil pour signaler
          les environnements qui te correspondent le mieux.
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>Voir / Repasser</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardSurface,
    marginTop: 16,
    marginBottom: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DDEBE5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 4,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    fontFamily: displayFontFamily,
    color: Colors.text.strong,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  axesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  axisPill: {
    backgroundColor: Colors.accent.soft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  axisText: {
    color: Colors.accent.strong,
    fontFamily: titleFontFamily,
    fontSize: 12,
    fontWeight: '700',
  },
  insightBox: {
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: Colors.ui.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  insightTitle: {
    color: Colors.text.strong,
    fontFamily: titleFontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  insightText: {
    marginTop: 3,
    color: Colors.text.muted,
    fontFamily: bodyFontFamily,
    fontSize: 12,
    lineHeight: 17,
  },
  button: {
    backgroundColor: Colors.ui.surfaceMuted,
    minHeight: 48,
    paddingVertical: 11,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B2735',
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginTop: 14,
  },
  buttonLabel: {
    color: Colors.text.strong,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: titleFontFamily,
  },
});
