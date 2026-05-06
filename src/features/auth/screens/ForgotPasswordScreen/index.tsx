import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Branding } from '@/assets';
import BackgroundRadial from '@/components/layout/BackgroundRadial';
import KeyboardAwareScrollView from '@/components/layout/KeyboardAwareScrollView';
import LoginLink from '@/features/auth/components/LoginLink';
import SigninLink from '@/features/auth/components/SigninLink';
import ForgotPasswordForm from '@/features/auth/forms/ForgotPasswordForm';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  displayFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { AuthStackParamList } from '@/types/navigation';

const inputTheme = {
  colors: {
    primary: Colors.accent.primary,
    error: Colors.error,
    outline: 'rgba(31,31,31,0.10)',
    onSurfaceVariant: 'rgba(31,31,31,0.58)',
  },
};

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
        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.logoContainer}>
            <Branding.Logo width={286} height={121} />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.heroTitle}>Mot de passe oublié</Text>
              <Text style={styles.heroSubtitle}>
                Reçois un lien de réinitialisation sur ton adresse email.
              </Text>
            </View>

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
                  contentStyle={styles.inputContent}
                  outlineStyle={styles.inputOutline}
                  activeOutlineColor={Colors.accent.primary}
                  outlineColor="rgba(31,31,31,0.10)"
                  theme={inputTheme}
                />

                <Button
                  mode="contained"
                  onPress={handleTokenSubmit}
                  disabled={!token.trim()}
                  buttonColor={Colors.accent.primary}
                  textColor="#FFFFFF"
                  contentStyle={styles.continueButtonContent}
                  style={styles.continueButton}
                  labelStyle={styles.continueButtonLabel}
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
  scroll: { flex: 1 },
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
    color: 'rgba(31,31,31,0.62)',
    marginBottom: 10,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#F8FAF8',
    fontFamily: bodyFontFamily,
  },
  inputContent: {
    minHeight: 76,
    fontFamily: bodyFontFamily,
    color: '#111820',
  },
  inputOutline: {
    borderRadius: 16,
    borderWidth: 1,
  },
  continueButton: {
    marginTop: 8,
    borderRadius: 16,
    shadowColor: '#1A5C45',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  continueButtonContent: {
    minHeight: 52,
  },
  continueButtonLabel: {
    fontFamily: titleFontFamily,
    fontSize: 16,
    fontWeight: '700',
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
