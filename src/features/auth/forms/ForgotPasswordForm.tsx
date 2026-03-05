import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { requestPasswordReset } from '@/api/auth';
import { forgotPasswordSchema } from '@/schemas/forgot-password';
import { titleFontFamily } from '@/themes/typography';
import { getApiErrorMessage } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

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
    <View style={styles.inputContainer}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        disabled={loading}
        error={!!error}
      />

      {error && <HelperText type="error">{error}</HelperText>}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        buttonColor="#E9E6E2"
        textColor="#2B2A29"
        style={styles.continueButton}
        labelStyle={styles.continueButtonLabel}
      >
        Envoyer le lien
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  continueButton: {
    marginTop: 12,
    borderRadius: 16,
  },
  continueButtonLabel: {
    fontFamily: titleFontFamily,
    fontSize: 15,
  },
});
