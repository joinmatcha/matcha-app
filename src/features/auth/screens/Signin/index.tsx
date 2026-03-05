import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Branding } from '@/assets';
import CGUModal from '@/components/Modals/CGUModal';
import PrivacyModal from '@/components/Modals/PrivacyModal';
import BackgroundRadial from '@/components/layout/BackgroundRadial';
import TermsAndPrivacyText from '@/components/ui/TermsAndPrivacyText';
import LoginLink from '@/features/auth/components/LoginLink';
import RegistrationForm from '@/features/auth/forms/RegistrationForm';
import { useModal } from '@/hooks/useModals';
import { bodyFontFamily, displayFontFamily } from '@/themes/typography';
import { cardSurface } from '@/themes/ui';

export default function SigninScreen() {
  const termsModal = useModal();
  const privacyModal = useModal();

  return (
    <BackgroundRadial bubbles>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Branding.Logo />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Inscription</Text>
            <Text style={styles.subtitle}>
              Crée ton compte pour accéder aux tests et recommandations.
            </Text>

            <RegistrationForm />

            <Portal>
              <CGUModal
                visible={termsModal.visible}
                onDismiss={termsModal.hide}
              />
              <PrivacyModal
                visible={privacyModal.visible}
                onDismiss={privacyModal.hide}
              />
            </Portal>

            <TermsAndPrivacyText
              showModalTerms={termsModal.show}
              showModalPrivacy={privacyModal.show}
            />

            <View style={styles.linksContainer}>
              <LoginLink />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 5,
  },
  card: {
    ...cardSurface,
    paddingHorizontal: 22,
    paddingVertical: 24,
    zIndex: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: displayFontFamily,
    color: '#1F1F1F',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: bodyFontFamily,
    color: 'rgba(45,33,27,0.72)',
    lineHeight: 22,
    marginBottom: 22,
  },
  linksContainer: {
    marginTop: 10,
    alignItems: 'center',
    gap: 4,
  },
});
