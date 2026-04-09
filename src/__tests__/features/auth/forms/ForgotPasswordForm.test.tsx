import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import ForgotPasswordForm from '@/features/auth/forms/ForgotPasswordForm';

const mockRequestReset = jest.fn().mockResolvedValue({});
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/api/auth', () => ({
  requestPasswordReset: (...args: any[]) => mockRequestReset(...args),
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

describe('ForgotPasswordForm', () => {
  const setSent = jest.fn();

  it('se rend sans erreur', () => {
    expect(() =>
      render(<ForgotPasswordForm setSent={setSent} />),
    ).not.toThrow();
  });

  it('affiche le champ email et le bouton', () => {
    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordForm setSent={setSent} />,
    );
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByText('Envoyer le lien')).toBeTruthy();
  });

  it('ne soumet pas avec un email vide', async () => {
    mockRequestReset.mockClear();
    const { getByText } = render(<ForgotPasswordForm setSent={setSent} />);

    await act(async () => {
      fireEvent.press(getByText('Envoyer le lien'));
    });

    expect(mockRequestReset).not.toHaveBeenCalled();
  });

  it('soumet avec un email valide', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordForm setSent={setSent} />,
    );

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@test.com');
    });

    await act(async () => {
      fireEvent.press(getByText('Envoyer le lien'));
    });

    expect(mockRequestReset).toHaveBeenCalledWith('test@test.com');
    expect(setSent).toHaveBeenCalledWith(true);
  });
});
