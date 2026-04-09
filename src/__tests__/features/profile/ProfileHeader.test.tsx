import { render } from '@testing-library/react-native';
import React from 'react';

import ProfileHeader from '@/features/profile/components/ProfileHeader';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

const user = {
  id: 'u1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@test.com',
  isEmailVerified: true,
  avatarUrl: null,
} as any;

describe('ProfileHeader', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<ProfileHeader user={user} />)).not.toThrow();
  });

  it("affiche les initiales quand pas d'avatar", () => {
    const { getByText } = render(<ProfileHeader user={user} />);
    expect(getByText('JD')).toBeTruthy();
  });

  it("affiche le nom et l'email", () => {
    const { getByText } = render(<ProfileHeader user={user} />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@test.com')).toBeTruthy();
  });

  it("affiche Vérifié quand l'email est vérifié", () => {
    const { getByText } = render(<ProfileHeader user={user} />);
    expect(getByText('Vérifié')).toBeTruthy();
  });

  it("affiche À confirmer quand l'email n'est pas vérifié", () => {
    const { getByText } = render(
      <ProfileHeader user={{ ...user, isEmailVerified: false }} />,
    );
    expect(getByText('À confirmer')).toBeTruthy();
  });
});
