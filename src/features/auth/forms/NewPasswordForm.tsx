import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { resetPassword } from '@/api/auth';
import { newPasswordSchema } from '@/schemas/password-reset';
import { titleFontFamily } from '@/themes/typography';
import { getApiErrorMessage } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

interface NewPasswordFormProps {
  token: string;
  onSuccess: () => void;
}

export default function NewPasswordForm({
  token,
  onSuccess,
}: NewPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const { valid, errors } = validateZod(newPasswordSchema, {
      password,
      confirm,
    });

    if (!valid) {
      setError(errors.password || errors.confirm);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword(token, password);

      setTimeout(onSuccess, 1200);
    } catch (err) {
      const errorMessage = getApiErrorMessage(
        err,
        'Le token est invalide ou expiré.',
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        label="Nouveau mot de passe"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        disabled={loading}
        error={!!error}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <TextInput
        label="Confirmer le mot de passe"
        value={confirm}
        onChangeText={setConfirm}
        mode="outlined"
        secureTextEntry={!showConfirm}
        style={styles.input}
        disabled={loading}
        error={!!error}
        right={
          <TextInput.Icon
            icon={showConfirm ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirm(!showConfirm)}
          />
        }
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
        Réinitialiser le mot de passe
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
