import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import AuthCard from '@/features/auth/components/AuthCard';
import AuthLayout from '@/features/auth/components/AuthLayout';
import ForgotPasswordLink from '@/features/auth/components/ForgotPasswordLink';
import SigninLink from '@/features/auth/components/SigninLink';
import LoginForm from '@/features/auth/forms/LoginForm';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import type { AuthStackParamList } from '@/types/navigation';

export default function LoginScreen() {
  const route = useRoute<RouteProp<AuthStackParamList, 'Login'>>();
  const registeredEmail = route.params?.registeredEmail;

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Bon retour"
        title="Connexion"
        subtitle="Retrouve tes tests, tes métiers favoris et tes recommandations."
      >
        {registeredEmail ? (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Compte créé</Text>
            <Text style={styles.noticeText}>
              Vérifie ta boîte mail pour confirmer {registeredEmail}, puis
              connecte-toi.
            </Text>
          </View>
        ) : null}

        <LoginForm />
        <View style={styles.links}>
          <SigninLink />
          <ForgotPasswordLink />
        </View>
      </AuthCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  links: {
    marginTop: 14,
    alignItems: 'center',
    gap: 4,
  },
  notice: {
    marginBottom: 14,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E8F2EE',
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.12)',
  },
  noticeTitle: {
    marginBottom: 4,
    fontSize: 14,
    fontFamily: titleFontFamily,
    fontWeight: '700',
    color: Colors.accent.primary,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: bodyFontFamily,
    color: Colors.text.strong,
  },
});
