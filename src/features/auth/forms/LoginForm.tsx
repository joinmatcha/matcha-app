import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/schemas/login';
import { titleFontFamily } from '@/themes/typography';
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: '', password: '' });

  const [authError, setAuthError] = useState('');

  const handleLogin = async () => {
    setAuthError('');

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
          'Ton email n’est pas encore vérifié. Vérifie ta boîte mail.',
        );
        return;
      }

      setAuthError(getApiErrorMessage(error, 'Veuillez réessayer.'));
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
        autoCorrect={false}
        textContentType="emailAddress"
        style={styles.input}
        disabled={loading}
        error={!!errors.email}
      />
      {errors.email && <HelperText type="error">{errors.email}</HelperText>}

      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setMotDePasse}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        disabled={loading}
        error={!!errors.password}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      {errors.password && (
        <HelperText type="error">{errors.password}</HelperText>
      )}

      {!!authError && (
        <HelperText type="error" visible>
          {authError}
        </HelperText>
      )}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        buttonColor="#E9E6E2"
        textColor="#2B2A29"
        style={styles.continueButton}
        labelStyle={styles.continueButtonLabel}
      >
        Continuer
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
