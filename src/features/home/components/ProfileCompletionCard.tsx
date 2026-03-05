import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ProgressBar from '@/components/ui/ProgressBar';
import { titleFontFamily } from '@/themes/typography';
import { cardSurface, secondaryButton, secondaryButtonText } from '@/themes/ui';

export default function ProfileCompletionCard({
  completion,
  onPress,
}: {
  completion: number;
  onPress: () => void;
}) {
  if (completion >= 100) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Complète ton profil</Text>

      <ProgressBar value={completion} />

      <Text style={styles.progressText}>Profil complété à {completion}%</Text>

      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.primaryButton}
        onPress={onPress}
      >
        <Text style={styles.primaryButtonLabel}>Compléter mon profil</Text>
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
    fontSize: 20,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: '#1F1F1F',
    marginBottom: 14,
  },
  progressText: {
    fontSize: 14,
    marginTop: 10,
    color: 'rgba(0,0,0,0.60)',
  },
  primaryButton: {
    ...secondaryButton,
    marginTop: 10,
  },
  primaryButtonLabel: {
    ...secondaryButtonText,
    letterSpacing: 0.4,
  },
});
