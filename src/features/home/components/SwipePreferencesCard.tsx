import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Preferences } from '@/features/swipe/api/preferencesApi';
import Colors from '@/themes/colors';

type Props = {
  preferences: Preferences;
  onSwipePress: () => void;
};

export default function SwipePreferencesCard({
  preferences,
  onSwipePress,
}: Props) {
  const { totalLikes, topSectors, topCompetences } = preferences;

  if (totalLikes === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Mes préférences métiers</Text>
        <Text style={styles.description}>
          Swipe des métiers pour découvrir tes préférences.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onSwipePress}>
          <Text style={styles.buttonLabel}>Commencer à swiper</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Mes préférences métiers</Text>
      <Text style={styles.counter}>
        {totalLikes} métier{totalLikes > 1 ? 's' : ''} aimé
        {totalLikes > 1 ? 's' : ''}
      </Text>

      {topSectors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Secteurs favoris</Text>
          <View style={styles.badges}>
            {topSectors.map((s) => (
              <View key={s.key} style={styles.badge}>
                <Text style={styles.badgeText}>{s.key}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {topCompetences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Compétences recherchées</Text>
          <View style={styles.badges}>
            {topCompetences.map((c) => (
              <View key={c.key} style={styles.badgeLight}>
                <Text style={styles.badgeLightText}>{c.key}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={onSwipePress}>
        <Text style={styles.buttonLabel}>Continuer à swiper</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffffdd',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    color: '#062314',
    opacity: 0.7,
    marginBottom: 6,
  },
  counter: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.success,
    marginBottom: 14,
  },
  description: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    color: 'rgba(0,0,0,0.60)',
    lineHeight: 20,
  },
  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '600',
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.greenLight.light.normal,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.greenLight.dark.normal,
  },
  badgeLight: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeLightText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.greyDark.normal,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});
