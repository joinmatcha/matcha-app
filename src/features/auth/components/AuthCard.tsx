import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#5C5148',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  header: {
    marginBottom: 18,
  },
  eyebrow: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: titleFontFamily,
    color: Colors.accent.primary,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: titleFontFamily,
    fontWeight: '600',
    color: Colors.text.strong,
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: 9,
    fontSize: 16,
    lineHeight: 23,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
});
