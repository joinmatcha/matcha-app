import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { useAuth } from '@/hooks/useAuth';
import { registrationSchema } from '@/schemas/registration';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import type { AuthStackParamList } from '@/types/navigation';
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

type NavProps = NativeStackNavigationProp<AuthStackParamList>;

const inputTheme = {
  colors: {
    primary: Colors.accent.primary,
    error: Colors.error,
    outline: 'rgba(31,31,31,0.10)',
    onSurfaceVariant: 'rgba(31,31,31,0.58)',
  },
};

export default function RegistrationForm() {
  const navigation = useNavigation<NavProps>();
  const { register } = useAuth();

  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [authError, setAuthError] = useState('');

  const resetServerError = () => setAuthError('');

  const handleRegister = async () => {
    resetServerError();

    const { valid, errors: zodErrors } = validateZod(registrationSchema, {
      firstName,
      lastName,
      email,
      password,
    });

    setErrors({
      firstName: zodErrors.firstName || '',
      lastName: zodErrors.lastName || '',
      email: zodErrors.email || '',
      password: zodErrors.password || '',
    });

    if (!valid) return;

    setLoading(true);
    try {
      await register({ email, password, firstName, lastName });

      navigation.navigate('Login');
    } catch (error) {
      let msg = 'Impossible de créer le compte. Réessaie.';
      const status = getApiErrorStatus(error);

      if (status === 409) {
        msg = 'Un compte existe déjà avec cet email.';
      } else if (status === 422) {
        msg = 'Certaines informations sont invalides.';
      } else if (status === 429) {
        msg = 'Trop de tentatives. Réessaie dans quelques minutes.';
      } else if (status && status >= 500) {
        msg = 'Serveur indisponible. Réessaie plus tard.';
      } else {
        msg = getApiErrorMessage(error, msg);
      }

      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        label="Prénom"
        value={firstName}
        onChangeText={(v) => {
          setFirstname(v);
          resetServerError();
        }}
        mode="outlined"
        style={styles.input}
        contentStyle={styles.inputContent}
        outlineStyle={styles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(31,31,31,0.10)"
        theme={inputTheme}
        disabled={loading}
        error={!!errors.firstName}
        left={<TextInput.Icon icon="account-outline" />}
      />
      {errors.firstName ? (
        <HelperText type="error">{errors.firstName}</HelperText>
      ) : null}

      <TextInput
        label="Nom"
        value={lastName}
        onChangeText={(v) => {
          setLastname(v);
          resetServerError();
        }}
        mode="outlined"
        style={styles.input}
        contentStyle={styles.inputContent}
        outlineStyle={styles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(31,31,31,0.10)"
        theme={inputTheme}
        disabled={loading}
        error={!!errors.lastName}
        left={<TextInput.Icon icon="account-outline" />}
      />
      {errors.lastName ? (
        <HelperText type="error">{errors.lastName}</HelperText>
      ) : null}

      <TextInput
        label="Email"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          resetServerError();
        }}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        mode="outlined"
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
      {errors.email ? (
        <HelperText type="error">{errors.email}</HelperText>
      ) : null}

      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          resetServerError();
        }}
        secureTextEntry={!showPassword}
        textContentType="password"
        mode="outlined"
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
            onPress={() => setShowPassword((s) => !s)}
          />
        }
      />
      {errors.password ? (
        <HelperText type="error">{errors.password}</HelperText>
      ) : null}

      {authError ? (
        <HelperText type="error" visible style={styles.authError}>
          {authError}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        loading={loading}
        disabled={loading}
        buttonColor={Colors.accent.primary}
        textColor="#FFFFFF"
        contentStyle={styles.continueButtonContent}
        style={styles.continueButton}
        labelStyle={styles.continueButtonLabel}
        onPress={handleRegister}
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
  authError: {
    marginTop: 8,
    marginBottom: 4,
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
