import React, { useState } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import { resendVerificationEmail } from '@/api/auth';
import MatchaButton from '@/components/ui/MatchaButton';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/schemas/login';
import Colors from '@/themes/colors';
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

import { authFormStyles, authInputTheme } from './authFormStyles';

export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const [errors, setErrors] = useState({ email: '', password: '' });

  const [authError, setAuthError] = useState('');

  const handleLogin = async () => {
    setAuthError('');
    setNeedsVerification(false);
    setVerificationMessage('');

    const { valid, errors: zodErrors } = validateZod(loginSchema, {
      email,
      password,
    });

    setErrors({
      email: zodErrors.email || '',
      password: zodErrors.password || '',
    });

    if (!valid) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      const status = getApiErrorStatus(error);
      if (status === 401) {
        setAuthError('Email ou mot de passe incorrect.');
        return;
      }

      if (status === 403) {
        setAuthError(
          'Ton email n’est pas encore vérifié. Vérifie ta boîte mail, y compris les spams.',
        );
        setNeedsVerification(true);
        return;
      }

      setAuthError(getApiErrorMessage(error, 'Veuillez réessayer.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationMessage('');
    setResendingVerification(true);

    try {
      await resendVerificationEmail(email);
      setVerificationMessage(
        'Si ce compte existe et doit être vérifié, un nouvel email vient d’être envoyé.',
      );
    } catch (error) {
      setVerificationMessage(
        getApiErrorMessage(error, 'Impossible de renvoyer l’email.'),
      );
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <View style={authFormStyles.inputContainer}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        style={authFormStyles.input}
        contentStyle={authFormStyles.inputContent}
        outlineStyle={authFormStyles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(0,81,58,0.12)"
        theme={authInputTheme}
        disabled={loading}
        error={!!errors.email}
        left={<TextInput.Icon icon="email-outline" />}
      />
      {errors.email && (
        <HelperText type="error" style={authFormStyles.helper}>
          {errors.email}
        </HelperText>
      )}

      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setMotDePasse}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={authFormStyles.input}
        contentStyle={authFormStyles.inputContent}
        outlineStyle={authFormStyles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(0,81,58,0.12)"
        theme={authInputTheme}
        disabled={loading}
        error={!!errors.password}
        left={<TextInput.Icon icon="lock-outline" />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      {errors.password && (
        <HelperText type="error" style={authFormStyles.helper}>
          {errors.password}
        </HelperText>
      )}

      {!!authError && (
        <HelperText type="error" visible style={authFormStyles.helper}>
          {authError}
        </HelperText>
      )}

      {needsVerification && (
        <MatchaButton
          label="Renvoyer l’email"
          icon="mail-outline"
          onPress={handleResendVerification}
          loading={resendingVerification}
          disabled={resendingVerification}
          variant="light"
          fullWidth
        />
      )}

      {!!verificationMessage && (
        <HelperText type="info" visible style={authFormStyles.helper}>
          {verificationMessage}
        </HelperText>
      )}

      <MatchaButton
        label="Continuer"
        icon="arrow-forward"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        variant="primary"
        fullWidth
        style={authFormStyles.submitButton}
      />
    </View>
  );
}
