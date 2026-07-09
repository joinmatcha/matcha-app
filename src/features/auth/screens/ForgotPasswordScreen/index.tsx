import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import MatchaButton from '@/components/ui/MatchaButton';
import AuthCard from '@/features/auth/components/AuthCard';
import AuthLayout from '@/features/auth/components/AuthLayout';
import LoginLink from '@/features/auth/components/LoginLink';
import SigninLink from '@/features/auth/components/SigninLink';
import ForgotPasswordForm from '@/features/auth/forms/ForgotPasswordForm';
import {
  authFormStyles,
  authInputTheme,
} from '@/features/auth/forms/authFormStyles';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import { AuthStackParamList } from '@/types/navigation';

export default function ForgotPasswordScreen() {
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleTokenSubmit = () => {
    if (!token.trim()) return;

    let cleanToken = token.trim();
    const tokenMatch = cleanToken.match(/token=([^&\s]+)/);
    if (tokenMatch) cleanToken = tokenMatch[1];

    navigation.navigate('ResetPassword', { token: cleanToken });
  };

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Accès au compte"
        title="Mot de passe oublié"
        subtitle="On t’envoie un lien pour sécuriser ton compte et reprendre ton parcours."
      >
        {!sent ? (
          <ForgotPasswordForm setSent={setSent} />
        ) : (
          <View style={styles.sentBlock}>
            <View style={styles.successPill}>
              <Text style={styles.successText}>Email envoyé</Text>
            </View>
            <Text style={styles.infoText}>
              Si un compte existe avec cette adresse, tu recevras un lien de
              réinitialisation.
            </Text>

            <Text style={styles.testLabel}>Mode test</Text>
            <Text style={styles.helperText}>
              Colle l’URL reçue ou uniquement la valeur après ?token=.
            </Text>

            <TextInput
              mode="outlined"
              label="Token de réinitialisation"
              value={token}
              onChangeText={setToken}
              placeholder="Collez ici le token"
              multiline
              style={styles.tokenInput}
              contentStyle={styles.tokenInputContent}
              outlineStyle={authFormStyles.inputOutline}
              activeOutlineColor={Colors.accent.primary}
              outlineColor="rgba(0,81,58,0.12)"
              theme={authInputTheme}
            />

            <MatchaButton
              label="Continuer"
              icon="arrow-forward"
              variant="primary"
              disabled={!token.trim()}
              onPress={handleTokenSubmit}
              fullWidth
              style={authFormStyles.submitButton}
            />

            <MatchaButton
              label="Renvoyer un email"
              icon="refresh"
              onPress={() => setSent(false)}
              style={styles.resendButton}
            />
          </View>
        )}

        <View style={styles.links}>
          <SigninLink />
          <LoginLink />
        </View>
      </AuthCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  sentBlock: {
    gap: 8,
  },
  successPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.accent.soft,
  },
  successText: {
    fontSize: 13,
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
  },
  infoText: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  testLabel: {
    marginTop: 12,
    fontSize: 15,
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: Colors.text.soft,
  },
  tokenInput: {
    minHeight: 82,
    backgroundColor: '#F7FAF8',
    fontFamily: bodyFontFamily,
  },
  tokenInputContent: {
    minHeight: 82,
    fontFamily: bodyFontFamily,
    color: Colors.text.strong,
  },
  resendButton: {
    marginTop: 2,
  },
  links: {
    marginTop: 14,
    alignItems: 'center',
    gap: 4,
  },
});
