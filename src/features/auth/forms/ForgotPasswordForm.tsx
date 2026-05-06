import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { requestPasswordReset } from '@/api/auth';
import { forgotPasswordSchema } from '@/schemas/forgot-password';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import { getApiErrorMessage } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

const inputTheme = {
  colors: {
    primary: Colors.accent.primary,
    error: Colors.error,
    outline: 'rgba(31,31,31,0.10)',
    onSurfaceVariant: 'rgba(31,31,31,0.58)',
  },
};

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
        contentStyle={styles.inputContent}
        outlineStyle={styles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(31,31,31,0.10)"
        theme={inputTheme}
        disabled={loading}
        error={!!error}
        left={<TextInput.Icon icon="email-outline" />}
      />

      {error && <HelperText type="error">{error}</HelperText>}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        buttonColor={Colors.accent.primary}
        textColor="#FFFFFF"
        contentStyle={styles.continueButtonContent}
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
    marginBottom: 18,
  },
  input: {
    marginBottom: 6,
    backgroundColor: '#F8FAF8',
    fontFamily: bodyFontFamily,
    height: 54,
  },
  inputContent: {
    height: 54,
    fontFamily: bodyFontFamily,
    color: '#111820',
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputOutline: {
    borderRadius: 16,
    borderWidth: 1,
  },
  continueButton: {
    marginTop: 14,
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
});
