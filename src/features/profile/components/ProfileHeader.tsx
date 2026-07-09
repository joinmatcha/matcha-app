import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import { UserFull } from '@/types/user';

export default function ProfileHeader({ user }: { user: UserFull }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.heroCard}>
        <View style={styles.identityBlock}>
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
    marginBottom: 18,
  },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'stretch',
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 8,
    shadowColor: '#22332C',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  identityBlock: {
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 26,
    lineHeight: 31,
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    letterSpacing: 0,
  },
  email: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  metaPill: {
    backgroundColor: '#F3F6F4',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: 'center',
    minWidth: 112,
  },
  metaLabel: {
    fontSize: 12,
    fontFamily: bodyFontFamily,
    color: Colors.text.soft,
  },
  metaValue: {
    marginTop: 3,
    fontSize: 14,
    fontFamily: titleFontFamily,
    color: Colors.accent.primary,
  },
});
