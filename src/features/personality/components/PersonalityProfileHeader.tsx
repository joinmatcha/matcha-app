import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Branding } from '@/assets';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import { cardSurface } from '@/themes/ui';

interface PersonalityProfileHeaderProps {
  label: string;
  type?: string;
  showLogo?: boolean;
}

export default function PersonalityProfileHeader({
  label,
  type,
  showLogo = true,
}: PersonalityProfileHeaderProps) {
  return (
    <>
      {showLogo && (
        <View style={styles.logoContainer}>
          <Branding.Logo width={110} height={34} />
        </View>
      )}

      <View style={styles.profileHeader}>
        <Text style={styles.profileTitle}>Ton profil</Text>
        <Text style={styles.profileLabel}>{label}</Text>
        {!!type && <Text style={styles.profileType}>{type}</Text>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    paddingTop: 40,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    ...cardSurface,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  profileLabel: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
    textAlign: 'center',
    letterSpacing: 0,
  },
  profileType: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '400',
    fontFamily: titleFontFamily,
    letterSpacing: 1.6,
    color: Colors.text.muted,
    opacity: 0.9,
    textTransform: 'uppercase',
  },
});
