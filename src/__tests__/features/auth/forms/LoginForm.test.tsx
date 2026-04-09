import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import LoginForm from '@/features/auth/forms/LoginForm';

const mockLogin = jest.fn().mockResolvedValue(undefined);
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
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

describe('LoginForm', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<LoginForm />)).not.toThrow();
  });

  it('affiche les champs email et mot de passe', () => {
    const { getByPlaceholderText } = render(<LoginForm />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
  });

  it('affiche le bouton Continuer', () => {
    const { getByText } = render(<LoginForm />);
    expect(getByText('Continuer')).toBeTruthy();
  });

  it('appelle login avec des données valides', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@test.com');
      fireEvent.changeText(
        getByPlaceholderText('Mot de passe'),
        'Password123!',
      );
    });

    await act(async () => {
      fireEvent.press(getByText('Continuer'));
    });

    expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'Password123!');
  });

  it('ne soumet pas avec des champs vides', async () => {
    mockLogin.mockClear();
    const { getByText } = render(<LoginForm />);

    await act(async () => {
      fireEvent.press(getByText('Continuer'));
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });
});
