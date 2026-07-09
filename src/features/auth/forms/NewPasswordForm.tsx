import React, { useState } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import { resetPassword } from '@/api/auth';
import MatchaButton from '@/components/ui/MatchaButton';
import { newPasswordSchema } from '@/schemas/password-reset';
import Colors from '@/themes/colors';
import { getApiErrorMessage } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

import { authFormStyles, authInputTheme } from './authFormStyles';

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
    <View style={authFormStyles.inputContainer}>
      <TextInput
        label="Nouveau mot de passe"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={authFormStyles.input}
        contentStyle={authFormStyles.inputContent}
        outlineStyle={authFormStyles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(0,81,58,0.12)"
        theme={authInputTheme}
        disabled={loading}
        error={!!error}
        left={<TextInput.Icon icon="lock-outline" />}
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
        style={authFormStyles.input}
        contentStyle={authFormStyles.inputContent}
        outlineStyle={authFormStyles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(0,81,58,0.12)"
        theme={authInputTheme}
        disabled={loading}
        error={!!error}
        left={<TextInput.Icon icon="lock-check-outline" />}
        right={
          <TextInput.Icon
            icon={showConfirm ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirm(!showConfirm)}
          />
        }
      />

      {error && (
        <HelperText type="error" style={authFormStyles.helper}>
          {error}
        </HelperText>
      )}

      <MatchaButton
        label="Réinitialiser le mot de passe"
        icon="check"
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
