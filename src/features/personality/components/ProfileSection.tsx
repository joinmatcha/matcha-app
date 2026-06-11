import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/themes/colors';
import { titleFontFamily } from '@/themes/typography';
import { cardSurface } from '@/themes/ui';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
  headerRight?: React.ReactNode;
}

export default function ProfileSection({
  title,
  children,
  isLast = false,
  headerRight,
}: ProfileSectionProps) {
  return (
    <View style={[styles.section, isLast && styles.lastSection]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {headerRight}
      </View>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.base,
  },
});
