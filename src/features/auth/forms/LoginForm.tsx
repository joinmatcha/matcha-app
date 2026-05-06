import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/schemas/login';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

const inputTheme = {
  colors: {
    primary: Colors.accent.primary,
    error: Colors.error,
    outline: 'rgba(31,31,31,0.10)',
    onSurfaceVariant: 'rgba(31,31,31,0.58)',
  },
};

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
        contentStyle={styles.inputContent}
        outlineStyle={styles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(31,31,31,0.10)"
        theme={inputTheme}
        disabled={loading}
        error={!!errors.email}
        left={<TextInput.Icon icon="email-outline" />}
      />
      {errors.email && <HelperText type="error">{errors.email}</HelperText>}

      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setMotDePasse}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        contentStyle={styles.inputContent}
        outlineStyle={styles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(31,31,31,0.10)"
        theme={inputTheme}
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
        buttonColor={Colors.accent.primary}
        textColor="#FFFFFF"
        contentStyle={styles.continueButtonContent}
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
