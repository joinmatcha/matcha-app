import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import RegistrationForm from '@/features/auth/forms/RegistrationForm';

const mockRegister = jest.fn().mockResolvedValue(undefined);
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ register: mockRegister }),
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

describe('RegistrationForm', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<RegistrationForm />)).not.toThrow();
  });

  it('affiche les 4 champs du formulaire', () => {
    const { getByPlaceholderText } = render(<RegistrationForm />);
    expect(getByPlaceholderText('Prénom')).toBeTruthy();
    expect(getByPlaceholderText('Nom')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
  });

  it('affiche le bouton Continuer', () => {
    const { getByText } = render(<RegistrationForm />);
    expect(getByText('Continuer')).toBeTruthy();
  });

  it('ne soumet pas avec des champs vides', async () => {
    mockRegister.mockClear();
    const { getByText } = render(<RegistrationForm />);

    await act(async () => {
      fireEvent.press(getByText('Continuer'));
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('soumet avec des données valides', async () => {
    const { getByPlaceholderText, getByText } = render(<RegistrationForm />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Prénom'), 'John');
      fireEvent.changeText(getByPlaceholderText('Nom'), 'Doe');
      fireEvent.changeText(getByPlaceholderText('Email'), 'john@test.com');
      fireEvent.changeText(
        getByPlaceholderText('Mot de passe'),
        'Password123!',
      );
    });

    await act(async () => {
      fireEvent.press(getByText('Continuer'));
    });

    expect(mockRegister).toHaveBeenCalled();
  });
});
