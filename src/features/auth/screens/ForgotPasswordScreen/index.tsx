import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Branding } from '@/assets';
import BackgroundRadial from '@/components/layout/BackgroundRadial';
import LoginLink from '@/features/auth/components/LoginLink';
import SigninLink from '@/features/auth/components/SigninLink';
import ForgotPasswordForm from '@/features/auth/forms/ForgotPasswordForm';
import {
  bodyFontFamily,
  displayFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { cardSurface } from '@/themes/ui';
import { AuthStackParamList } from '@/types/navigation';

export default function ForgotPasswordScreen() {
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleTokenSubmit = () => {
    if (token.trim()) {
      let cleanToken = token.trim();
      const tokenMatch = cleanToken.match(/token=([^&\s]+)/);
      if (tokenMatch) cleanToken = tokenMatch[1];

      navigation.navigate('ResetPassword', { token: cleanToken });
    }
  };

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
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.subtitle}>
              Renseigne ton email pour recevoir un lien de réinitialisation.
            </Text>

            {!sent ? (
              <ForgotPasswordForm setSent={setSent} />
            ) : (
              <View>
                <Text style={styles.infoText}>
                  Si cet email existe, un lien de réinitialisation a été envoyé.
                </Text>

                {/* Mode test */}
                <Text style={styles.subLabel}>
                  Mode test : collez le token ici
                </Text>
                <Text style={styles.helperText}>
                  Collez l’URL ou uniquement la valeur après ?token=
                </Text>

                <TextInput
                  mode="outlined"
                  label="Token de réinitialisation"
                  value={token}
                  onChangeText={setToken}
                  placeholder="Collez ici le token"
                  multiline
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  onPress={handleTokenSubmit}
                  disabled={!token.trim()}
                  buttonColor="#E9E6E2"
                  textColor="#2B2A29"
                  style={styles.continueButton}
                >
                  Continuer
                </Button>

                <Button
                  mode="text"
                  onPress={() => setSent(false)}
                  style={styles.resendButton}
                >
                  Renvoyer un email
                </Button>
              </View>
            )}

            <View style={styles.linksContainer}>
              <SigninLink />
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
  scroll: { flex: 1 },
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
  infoText: {
    fontSize: 15,
    fontFamily: bodyFontFamily,
    color: '#222',
    marginBottom: 20,
    lineHeight: 22,
  },
  subLabel: {
    fontSize: 14,
    fontFamily: titleFontFamily,
    color: '#1F1F1F',
    marginBottom: 6,
  },
  helperText: {
    fontSize: 12,
    fontFamily: bodyFontFamily,
    color: '#2A2A2A',
    marginBottom: 10,
  },
  input: {
    marginBottom: 12,
  },
  continueButton: {
    marginTop: 8,
    borderRadius: 16,
  },
  resendButton: {
    marginTop: 8,
  },
  linksContainer: {
    marginTop: 16,
    alignItems: 'center',
    gap: 4,
  },
});
