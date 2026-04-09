import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import ProfileSection from '@/features/personality/components/ProfileSection';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

describe('ProfileSection', () => {
  it('se rend avec le titre et les enfants', () => {
    const { getByText } = render(
      <ProfileSection title="Forces">
        <Text>Contenu</Text>
      </ProfileSection>,
    );
    expect(getByText('Forces')).toBeTruthy();
    expect(getByText('Contenu')).toBeTruthy();
  });

  it('se rend avec isLast', () => {
    expect(() =>
      render(
        <ProfileSection title="Forces" isLast>
          <Text>Contenu</Text>
        </ProfileSection>,
      ),
    ).not.toThrow();
  });
});
