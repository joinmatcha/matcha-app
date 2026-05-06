import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Branding } from '@/assets';
import CGUModal from '@/components/Modals/CGUModal';
import PrivacyModal from '@/components/Modals/PrivacyModal';
import BackgroundRadial from '@/components/layout/BackgroundRadial';
import KeyboardAwareScrollView from '@/components/layout/KeyboardAwareScrollView';
import TermsAndPrivacyText from '@/components/ui/TermsAndPrivacyText';
import LoginLink from '@/features/auth/components/LoginLink';
import RegistrationForm from '@/features/auth/forms/RegistrationForm';
import { useModal } from '@/hooks/useModals';
import { bodyFontFamily, displayFontFamily } from '@/themes/typography';

export default function SigninScreen() {
  const termsModal = useModal();
  const privacyModal = useModal();

  return (
    <BackgroundRadial bubbles>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.logoContainer}>
            <Branding.Logo width={286} height={121} />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.heroTitle}>Inscription</Text>
              <Text style={styles.heroSubtitle}>
                Crée ton espace pour explorer les métiers et suivre ton profil.
              </Text>
            </View>

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
        </KeyboardAwareScrollView>
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
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 18,
    zIndex: 5,
  },
  cardHeader: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '700',
    fontFamily: displayFontFamily,
    color: '#111820',
    letterSpacing: 0,
  },
  heroSubtitle: {
    marginTop: 7,
    fontSize: 14,
    fontFamily: bodyFontFamily,
    color: 'rgba(31,31,31,0.64)',
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(31,31,31,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 20,
    zIndex: 5,
    shadowColor: '#5C5148',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  linksContainer: {
    marginTop: 10,
    alignItems: 'center',
    gap: 4,
  },
});
