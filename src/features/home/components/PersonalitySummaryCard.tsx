import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '@/themes/colors';
import { displayFontFamily, titleFontFamily } from '@/themes/typography';
import {
  cardSurface,
  secondaryButton,
  secondaryButtonText,
  softBadge,
  softBadgeText,
} from '@/themes/ui';
import { UserFull } from '@/types/user';

type Props = {
  personality?: UserFull['personality'];
  onPress: () => void;
};

export default function PersonalitySummaryCard({
  personality,
  onPress,
}: Props) {
  if (!personality) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Ta personnalité</Text>

      <Text style={styles.label}>{personality.label}</Text>

      {!!personality.type && (
        <Text style={styles.type}>{personality.type}</Text>
      )}

      <View style={styles.badges}>
        {personality.strengths.slice(0, 3).map((strength, index) => (
          <View key={index} style={styles.badge}>
            <Text style={styles.badgeText}>{strength}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>Voir mon analyse</Text>
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
  type: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 3,
    color: '#1F1F1F',
    opacity: 0.7,
    marginBottom: 12,
  },
  label: {
    fontSize: 30,
    fontWeight: '600',
    fontFamily: displayFontFamily,
    color: Colors.accent.strong,
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  badge: {
    ...softBadge,
  },
  badgeText: {
    ...softBadgeText,
  },
  button: {
    ...secondaryButton,
    marginTop: 10,
  },
  buttonText: {
    ...secondaryButtonText,
  },
});
