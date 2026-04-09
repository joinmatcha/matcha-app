import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import NewPasswordForm from '@/features/auth/forms/NewPasswordForm';

const mockResetPassword = jest.fn().mockResolvedValue({});
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/api/auth', () => ({
  resetPassword: (...args: any[]) => mockResetPassword(...args),
}));
jest.mock('react-native-paper', () => {
  const { Text, Pressable, TextInput: RNTextInput } = require('react-native');
  return {
    Text,
    HelperText: ({ children }: any) => <Text>{children}</Text>,
    Button: ({ children, onPress, ...rest }: any) => (
      <Pressable onPress={onPress} {...rest}>
        <Text>{children}</Text>
      </Pressable>
    ),
    TextInput: Object.assign(
      ({ label, value, onChangeText, ...rest }: any) => (
        <RNTextInput
          placeholder={label}
          value={value}
          onChangeText={onChangeText}
          {...rest}
        />
      ),
      { Icon: () => null },
    ),
    DefaultTheme: { colors: {}, fonts: {} },
  };
});

describe('NewPasswordForm', () => {
  const onSuccess = jest.fn();

  it('se rend sans erreur', () => {
    expect(() =>
      render(<NewPasswordForm token="tok123" onSuccess={onSuccess} />),
    ).not.toThrow();
  });

  it('affiche les champs et le bouton', () => {
    const { getByPlaceholderText, getByText } = render(
      <NewPasswordForm token="tok123" onSuccess={onSuccess} />,
    );
    expect(getByPlaceholderText('Nouveau mot de passe')).toBeTruthy();
    expect(getByPlaceholderText('Confirmer le mot de passe')).toBeTruthy();
    expect(getByText('Réinitialiser le mot de passe')).toBeTruthy();
  });

  it('ne soumet pas avec des champs vides', async () => {
    mockResetPassword.mockClear();
    const { getByText } = render(
      <NewPasswordForm token="tok123" onSuccess={onSuccess} />,
    );

    await act(async () => {
      fireEvent.press(getByText('Réinitialiser le mot de passe'));
    });

    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('soumet avec des mots de passe valides', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NewPasswordForm token="tok123" onSuccess={onSuccess} />,
    );

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText('Nouveau mot de passe'),
        'Password123!',
      );
      fireEvent.changeText(
        getByPlaceholderText('Confirmer le mot de passe'),
        'Password123!',
      );
    });

    await act(async () => {
      fireEvent.press(getByText('Réinitialiser le mot de passe'));
    });

    expect(mockResetPassword).toHaveBeenCalledWith('tok123', 'Password123!');
  });
});
