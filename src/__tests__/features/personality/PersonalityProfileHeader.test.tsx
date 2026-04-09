import { render } from '@testing-library/react-native';
import React from 'react';

import PersonalityProfileHeader from '@/features/personality/components/PersonalityProfileHeader';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});
jest.mock('@/assets', () => ({
  Branding: {
    Logo: () => null,
  },
}));

describe('PersonalityProfileHeader', () => {
  it('se rend avec le label', () => {
    const { getByText } = render(
      <PersonalityProfileHeader label="Architecte" />,
    );
    expect(getByText('Architecte')).toBeTruthy();
    expect(getByText('Ton profil')).toBeTruthy();
  });

  it('affiche le type quand il est fourni', () => {
    const { getByText } = render(
      <PersonalityProfileHeader label="Architecte" type="INTJ" />,
    );
    expect(getByText('INTJ')).toBeTruthy();
  });

  it("n'affiche pas le type quand il est absent", () => {
    const { queryByText } = render(
      <PersonalityProfileHeader label="Architecte" />,
    );
    expect(queryByText('INTJ')).toBeNull();
  });
});
