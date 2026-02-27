import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { useAuth } from '@/hooks/useAuth';
import { registrationSchema } from '@/schemas/registration';
import type { AuthStackParamList } from '@/types/navigation';
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

type NavProps = NativeStackNavigationProp<AuthStackParamList>;

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

      Toast.show({
        type: 'success',
        text1: 'Inscription réussie',
        text2: 'Vérifie tes emails pour activer ton compte.',
        position: 'top',
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => Toast.hide(),
      });

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
        disabled={loading}
        error={!!errors.firstName}
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
        disabled={loading}
        error={!!errors.lastName}
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
        disabled={loading}
        error={!!errors.email}
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
        disabled={loading}
        error={!!errors.password}
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
        style={styles.continueButton}
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
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  authError: {
    marginTop: 8,
    marginBottom: 4,
  },
  continueButton: {
    marginTop: 12,
    borderRadius: 12,
  },
});
