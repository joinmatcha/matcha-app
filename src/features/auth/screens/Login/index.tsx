import React from 'react';
import { StyleSheet, View } from 'react-native';

import AuthCard from '@/features/auth/components/AuthCard';
import AuthLayout from '@/features/auth/components/AuthLayout';
import ForgotPasswordLink from '@/features/auth/components/ForgotPasswordLink';
import SigninLink from '@/features/auth/components/SigninLink';
import LoginForm from '@/features/auth/forms/LoginForm';

export default function LoginScreen() {
  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Bon retour"
        title="Connexion"
        subtitle="Retrouve tes tests, tes métiers favoris et tes recommandations."
      >
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
});
