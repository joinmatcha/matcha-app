import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  displayFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { cardSurface } from '@/themes/ui';
import { UserFull } from '@/types/user';

export default function ProfileHeader({ user }: { user: UserFull }) {
  const initials =
    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <View style={styles.wrapper}>
      <View style={styles.heroCard}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials || 'U'}</Text>
          </View>
        )}

        <View style={styles.identityBlock}>
          <Text style={styles.eyebrow}>PROFIL</Text>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Compte</Text>
            <Text style={styles.metaValue}>Actif</Text>
          </View>

          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>E-mail</Text>
            <Text style={styles.metaValue}>
              {user.isEmailVerified ? 'Vérifié' : 'À confirmer'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 26,
  },
  heroCard: {
    ...cardSurface,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  initialsCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EEF2EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 34,
    fontWeight: '700',
    fontFamily: displayFontFamily,
    color: '#1F1F1F',
  },
  identityBlock: {
    alignItems: 'center',
    marginTop: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    letterSpacing: 1,
    color: Colors.text.soft,
  },
  name: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: displayFontFamily,
    color: Colors.text.strong,
    letterSpacing: 0,
    textAlign: 'center',
  },
  email: {
    marginTop: 6,
    fontSize: 15,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  metaPill: {
    backgroundColor: 'rgba(248,251,249,0.95)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 112,
  },
  metaLabel: {
    fontSize: 11,
    fontFamily: bodyFontFamily,
    color: Colors.text.soft,
  },
  metaValue: {
    marginTop: 3,
    fontSize: 13,
    fontFamily: titleFontFamily,
    fontWeight: '600',
    color: Colors.accent.primary,
  },
});
