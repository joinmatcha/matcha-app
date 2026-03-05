import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { titleFontFamily } from '@/themes/typography';
import { cardSurface, secondaryButton, secondaryButtonText } from '@/themes/ui';

export default function TestCard({
  title,
  description,
  onPress,
  buttonLabel = 'Commencer',
}: {
  title: string;
  description: string;
  onPress: () => void;
  buttonLabel?: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardSurface,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: '#1F1F1F',
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(0,0,0,0.78)',
    lineHeight: 21,
    marginBottom: 16,
  },

  button: {
    ...secondaryButton,
    marginTop: 10,
  },

  buttonLabel: {
    ...secondaryButtonText,
  },
});
