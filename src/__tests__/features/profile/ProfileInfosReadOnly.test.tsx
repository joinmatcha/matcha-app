import { render } from '@testing-library/react-native';
import React from 'react';

import ProfileInfosReadOnly from '@/features/profile/components/ProfileInfosReadOnly';

jest.mock('react-native-paper', () => {
  const { Text, Pressable, TextInput: RNTextInput } = require('react-native');
  return {
    Text,
    DefaultTheme: { colors: {}, fonts: {} },
    Button: ({ children, onPress }: any) => (
      <Pressable onPress={onPress}>
        <Text>{children}</Text>
      </Pressable>
    ),
    HelperText: ({ children }: any) => <Text>{children}</Text>,
    TextInput: Object.assign(
      ({ label, value, onChangeText }: any) => (
        <RNTextInput
          placeholder={label}
          value={value}
          onChangeText={onChangeText}
        />
      ),
      { Icon: () => null },
    ),
  };
});
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/contexts/AuthContext', () => {
  const React = require('react');
  return { AuthContext: React.createContext({ logout: jest.fn() }) };
});
jest.mock('@/features/profile/api/profileApi', () => ({
  updateProfile: jest.fn().mockResolvedValue({}),
  changePassword: jest.fn().mockResolvedValue({}),
  requestEmailChange: jest.fn().mockResolvedValue({}),
}));

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

describe('ProfileInfosReadOnly', () => {
  const setEditSection = jest.fn();
  const onSaved = jest.fn();
  const onDelete = jest.fn();

  it('se rend sans erreur en mode lecture', () => {
    expect(() =>
      render(
        <ProfileInfosReadOnly
          user={user}
          editSection={null}
          setEditSection={setEditSection}
          onSaved={onSaved}
          onDelete={onDelete}
        />,
      ),
    ).not.toThrow();
  });

  it('affiche les informations personnelles', () => {
    const { getByText } = render(
      <ProfileInfosReadOnly
        user={user}
        editSection={null}
        setEditSection={setEditSection}
        onSaved={onSaved}
        onDelete={onDelete}
      />,
    );
    expect(getByText('John')).toBeTruthy();
    expect(getByText('Doe')).toBeTruthy();
    expect(getByText('Homme')).toBeTruthy();
  });

  it('affiche le bouton de suppression de compte', () => {
    const { getByText } = render(
      <ProfileInfosReadOnly
        user={user}
        editSection={null}
        setEditSection={setEditSection}
        onSaved={onSaved}
        onDelete={onDelete}
      />,
    );
    expect(getByText('Supprimer mon compte')).toBeTruthy();
  });

  it('affiche les données email et adresse', () => {
    const { getByText } = render(
      <ProfileInfosReadOnly
        user={user}
        editSection={null}
        setEditSection={setEditSection}
        onSaved={onSaved}
        onDelete={onDelete}
      />,
    );
    expect(getByText('a@b.com')).toBeTruthy();
    expect(getByText('Vérifiée')).toBeTruthy();
    expect(getByText('Paris')).toBeTruthy();
    expect(getByText('75001')).toBeTruthy();
  });

  it('affiche Accepté pour le consentement RGPD', () => {
    const { getByText } = render(
      <ProfileInfosReadOnly
        user={user}
        editSection={null}
        setEditSection={setEditSection}
        onSaved={onSaved}
        onDelete={onDelete}
      />,
    );
    expect(getByText('Accepté')).toBeTruthy();
  });

  it('se rend en mode édition personal', () => {
    expect(() =>
      render(
        <ProfileInfosReadOnly
          user={user}
          editSection="personal"
          setEditSection={setEditSection}
          onSaved={onSaved}
          onDelete={onDelete}
        />,
      ),
    ).not.toThrow();
  });

  it('se rend en mode édition email', () => {
    expect(() =>
      render(
        <ProfileInfosReadOnly
          user={user}
          editSection="email"
          setEditSection={setEditSection}
          onSaved={onSaved}
          onDelete={onDelete}
        />,
      ),
    ).not.toThrow();
  });

  it('se rend en mode édition password', () => {
    expect(() =>
      render(
        <ProfileInfosReadOnly
          user={user}
          editSection="password"
          setEditSection={setEditSection}
          onSaved={onSaved}
          onDelete={onDelete}
        />,
      ),
    ).not.toThrow();
  });

  it('se rend en mode édition address', () => {
    expect(() =>
      render(
        <ProfileInfosReadOnly
          user={user}
          editSection="address"
          setEditSection={setEditSection}
          onSaved={onSaved}
          onDelete={onDelete}
        />,
      ),
    ).not.toThrow();
  });

  it('se rend en mode édition work', () => {
    expect(() =>
      render(
        <ProfileInfosReadOnly
          user={user}
          editSection="work"
          setEditSection={setEditSection}
          onSaved={onSaved}
          onDelete={onDelete}
        />,
      ),
    ).not.toThrow();
  });

  it('se rend en mode édition privacy', () => {
    expect(() =>
      render(
        <ProfileInfosReadOnly
          user={user}
          editSection="privacy"
          setEditSection={setEditSection}
          onSaved={onSaved}
          onDelete={onDelete}
        />,
      ),
    ).not.toThrow();
  });

  it('gère un user avec remote=false et gender absent', () => {
    const sparseUser = {
      ...user,
      remote: false,
      gender: undefined,
      consentAccepted: false,
    };
    const { getByText } = render(
      <ProfileInfosReadOnly
        user={sparseUser}
        editSection={null}
        setEditSection={setEditSection}
        onSaved={onSaved}
        onDelete={onDelete}
      />,
    );
    expect(getByText('Non')).toBeTruthy();
    expect(getByText('Refusé')).toBeTruthy();
  });
});
