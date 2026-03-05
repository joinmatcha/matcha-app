import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/themes/colors';
import { titleFontFamily } from '@/themes/typography';
import { cardSurface } from '@/themes/ui';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}

export default function ProfileSection({
  title,
  children,
  isLast = false,
}: ProfileSectionProps) {
  return (
    <View style={[styles.section, isLast && styles.lastSection]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    ...cardSurface,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  lastSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.base,
    marginBottom: 14,
  },
});
