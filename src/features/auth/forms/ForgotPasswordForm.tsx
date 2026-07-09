import React, { useState } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import { requestPasswordReset } from '@/api/auth';
import MatchaButton from '@/components/ui/MatchaButton';
import { forgotPasswordSchema } from '@/schemas/forgot-password';
import Colors from '@/themes/colors';
import { getApiErrorMessage } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

import { authFormStyles, authInputTheme } from './authFormStyles';

interface ForgotPasswordFormProps {
  setSent: (value: boolean) => void;
}

export default function ForgotPasswordForm({
  setSent,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const { valid, errors } = validateZod(forgotPasswordSchema, { email });

    if (!valid) {
      setError(errors.email);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await requestPasswordReset(email);

      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Veuillez réessayer.'));
    } finally {
      setLoading(false);
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
        style={authFormStyles.input}
        contentStyle={authFormStyles.inputContent}
        outlineStyle={authFormStyles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(0,81,58,0.12)"
        theme={authInputTheme}
        disabled={loading}
        error={!!error}
        left={<TextInput.Icon icon="email-outline" />}
      />

      {error && (
        <HelperText type="error" style={authFormStyles.helper}>
          {error}
        </HelperText>
      )}

      <MatchaButton
        label="Envoyer le lien"
        icon="mail-outline"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        variant="primary"
        fullWidth
        style={authFormStyles.submitButton}
      />
    </View>
  );
}
