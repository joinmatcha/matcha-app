import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';

import CGUModal from '@/components/Modals/CGUModal';
import PrivacyModal from '@/components/Modals/PrivacyModal';
import TermsAndPrivacyText from '@/components/ui/TermsAndPrivacyText';
import AuthCard from '@/features/auth/components/AuthCard';
import AuthLayout from '@/features/auth/components/AuthLayout';
import LoginLink from '@/features/auth/components/LoginLink';
import RegistrationForm from '@/features/auth/forms/RegistrationForm';
import { useModal } from '@/hooks/useModals';

export default function SigninScreen() {
  const termsModal = useModal();
  const privacyModal = useModal();

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Bienvenue"
        title="Inscription"
        subtitle="Crée ton espace Matcha pour suivre ton profil et tes pistes métier."
      >
        <RegistrationForm />

        <Portal>
          <CGUModal visible={termsModal.visible} onDismiss={termsModal.hide} />
          <PrivacyModal
            visible={privacyModal.visible}
            onDismiss={privacyModal.hide}
          />
        </Portal>

        <TermsAndPrivacyText
          showModalTerms={termsModal.show}
          showModalPrivacy={privacyModal.show}
        />

        <View style={styles.links}>
          <LoginLink />
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
