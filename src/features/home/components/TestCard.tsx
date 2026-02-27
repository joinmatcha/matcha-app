import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '@/themes/colors';

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

      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonLabel}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffffdd',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#062314',
  },

  description: {
    marginTop: 6,
    fontSize: 15,
    color: 'rgba(0,0,0,0.55)',
    lineHeight: 22,
    marginBottom: 18,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonLabel: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});
