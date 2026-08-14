import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import ProfileSections from '@/features/profile/components/ProfileSections';

const mockUpdateProfile = jest.fn().mockResolvedValue({});
const mockChangePassword = jest.fn().mockResolvedValue({});
const mockRequestEmailChange = jest.fn().mockResolvedValue({});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/features/profile/api/profileApi', () => ({
  updateProfile: (...args: any[]) => mockUpdateProfile(...args),
  changePassword: (...args: any[]) => mockChangePassword(...args),
  requestEmailChange: (...args: any[]) => mockRequestEmailChange(...args),
}));
jest.mock('react-native-paper', () => {
  const { Text, Pressable, TextInput: RNTextInput } = require('react-native');
  return {
    Text,
    DefaultTheme: { colors: {}, fonts: {} },
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
  };
});
jest.mock('@/contexts/AuthContext', () => {
  const React = require('react');
  return { AuthContext: React.createContext({ logout: jest.fn() }) };
});

const user = {
  id: 'u1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'a@b.com',
  birthYear: 2000,
  gender: 'male',
  isEmailVerified: true,
  consentAccepted: true,
  locationPref: 'remote',
  remote: true,
  addressStreet: '1 rue',
  addressCity: 'Paris',
  addressPostalCode: '75001',
  addressCountry: 'France',
} as any;
const onCancel = jest.fn();
const onSaved = jest.fn();

describe('ProfileSections', () => {
  it('se rend en mode personal', () => {
    const { getByPlaceholderText } = render(
      <ProfileSections
        section="personal"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );
    expect(getByPlaceholderText('Prénom')).toBeTruthy();
    expect(getByPlaceholderText('Nom')).toBeTruthy();
  });

  it('se rend en mode email', () => {
    const { getByPlaceholderText } = render(
      <ProfileSections
        section="email"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );
    expect(getByPlaceholderText('Nouvel e-mail')).toBeTruthy();
  });

  it('se rend en mode password', () => {
    const { getByPlaceholderText } = render(
      <ProfileSections
        section="password"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );
    expect(getByPlaceholderText('Mot de passe actuel')).toBeTruthy();
    expect(getByPlaceholderText('Nouveau mot de passe')).toBeTruthy();
    expect(getByPlaceholderText('Confirmer le mot de passe')).toBeTruthy();
  });

  it('se rend en mode address', () => {
    const { getByPlaceholderText } = render(
      <ProfileSections
        section="address"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );
    expect(getByPlaceholderText('Rue')).toBeTruthy();
    expect(getByPlaceholderText('Ville')).toBeTruthy();
  });

  it('se rend en mode work', () => {
    expect(() =>
      render(
        <ProfileSections
          section="work"
          user={user}
          onCancel={onCancel}
          onSaved={onSaved}
        />,
      ),
    ).not.toThrow();
  });

  it('se rend en mode privacy', () => {
    expect(() =>
      render(
        <ProfileSections
          section="privacy"
          user={user}
          onCancel={onCancel}
          onSaved={onSaved}
        />,
      ),
    ).not.toThrow();
  });

  it('affiche les boutons Annuler et Enregistrer', () => {
    const { getByText } = render(
      <ProfileSections
        section="personal"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );
    expect(getByText('Annuler')).toBeTruthy();
    expect(getByText('Enregistrer')).toBeTruthy();
  });

  it('appelle onCancel quand on clique Annuler', () => {
    const { getByText } = render(
      <ProfileSections
        section="personal"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );
    fireEvent.press(getByText('Annuler'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('sauvegarde les infos personnelles', async () => {
    const { getByText } = render(
      <ProfileSections
        section="personal"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );

    await act(async () => {
      fireEvent.press(getByText('Enregistrer'));
    });

    expect(mockUpdateProfile).toHaveBeenCalled();
    expect(onSaved).toHaveBeenCalled();
  });

  it("sauvegarde l'adresse", async () => {
    mockUpdateProfile.mockClear();
    onSaved.mockClear();
    const { getByText } = render(
      <ProfileSections
        section="address"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );

    await act(async () => {
      fireEvent.press(getByText('Enregistrer'));
    });

    expect(mockUpdateProfile).toHaveBeenCalled();
  });

  it("nettoie les champs d'adresse avant sauvegarde", async () => {
    mockUpdateProfile.mockClear();
    const { getByPlaceholderText, getByText } = render(
      <ProfileSections
        section="address"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Ville'), 'Par1s!');
      fireEvent.changeText(
        getByPlaceholderText('Code postal'),
        '927272727272727272',
      );
      fireEvent.changeText(getByPlaceholderText('Pays'), '12France3');
    });

    await act(async () => {
      fireEvent.press(getByText('Enregistrer'));
    });

    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        addressCity: 'Pars',
        addressPostalCode: '927272727272',
        addressCountry: 'France',
      }),
    );
  });

  it('sauvegarde les préférences de travail', async () => {
    mockUpdateProfile.mockClear();
    const { getByText } = render(
      <ProfileSections
        section="work"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );

    await act(async () => {
      fireEvent.press(getByText('Enregistrer'));
    });

    expect(mockUpdateProfile).toHaveBeenCalled();
  });

  it('sauvegarde la confidentialité', async () => {
    mockUpdateProfile.mockClear();
    const { getByText } = render(
      <ProfileSections
        section="privacy"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );

    await act(async () => {
      fireEvent.press(getByText('Enregistrer'));
    });

    expect(mockUpdateProfile).toHaveBeenCalled();
  });

  it("change l'email", async () => {
    const { getByPlaceholderText, getByText } = render(
      <ProfileSections
        section="email"
        user={user}
        onCancel={onCancel}
        onSaved={onSaved}
      />,
    );

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText('Nouvel e-mail'),
        'new@test.com',
      );
    });

    await act(async () => {
      fireEvent.press(getByText('Enregistrer'));
    });

    expect(mockRequestEmailChange).toHaveBeenCalledWith('new@test.com');
  });
});
