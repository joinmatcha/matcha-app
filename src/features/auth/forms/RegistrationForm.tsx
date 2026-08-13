import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import MatchaButton from '@/components/ui/MatchaButton';
import { useAuth } from '@/hooks/useAuth';
import { registrationSchema } from '@/schemas/registration';
import Colors from '@/themes/colors';
import type { AuthStackParamList } from '@/types/navigation';
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

import { authFormStyles, authInputTheme } from './authFormStyles';

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

      navigation.navigate('Login', { registeredEmail: email.trim() });
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
    <View style={authFormStyles.inputContainer}>
      <TextInput
        label="Prénom"
        value={firstName}
        onChangeText={(v) => {
          setFirstname(v);
          resetServerError();
        }}
        mode="outlined"
        style={authFormStyles.input}
        contentStyle={authFormStyles.inputContent}
        outlineStyle={authFormStyles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(0,81,58,0.12)"
        theme={authInputTheme}
        disabled={loading}
        error={!!errors.firstName}
        left={<TextInput.Icon icon="account-outline" />}
      />
      {errors.firstName ? (
        <HelperText type="error" style={authFormStyles.helper}>
          {errors.firstName}
        </HelperText>
      ) : null}

      <TextInput
        label="Nom"
        value={lastName}
        onChangeText={(v) => {
          setLastname(v);
          resetServerError();
        }}
        mode="outlined"
        style={authFormStyles.input}
        contentStyle={authFormStyles.inputContent}
        outlineStyle={authFormStyles.inputOutline}
        activeOutlineColor={Colors.accent.primary}
        outlineColor="rgba(0,81,58,0.12)"
        theme={authInputTheme}
        disabled={loading}
        error={!!errors.lastName}
        left={<TextInput.Icon icon="account-outline" />}
      />
      {errors.lastName ? (
        <HelperText type="error" style={authFormStyles.helper}>
          {errors.lastName}
        </HelperText>
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
      {errors.email ? (
        <HelperText type="error" style={authFormStyles.helper}>
          {errors.email}
        </HelperText>
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
            onPress={() => setShowPassword((s) => !s)}
          />
        }
      />
      {errors.password ? (
        <HelperText type="error" style={authFormStyles.helper}>
          {errors.password}
        </HelperText>
      ) : null}

      {authError ? (
        <HelperText type="error" visible style={authFormStyles.helper}>
          {authError}
        </HelperText>
      ) : null}

      <MatchaButton
        label="Continuer"
        icon="arrow-forward"
        loading={loading}
        disabled={loading}
        variant="primary"
        fullWidth
        style={authFormStyles.submitButton}
        onPress={handleRegister}
      />
    </View>
  );
}
