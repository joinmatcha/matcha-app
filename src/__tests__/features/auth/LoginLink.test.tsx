import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import LoginLink from '@/features/auth/components/LoginLink';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
jest.mock('react-native-paper', () => {
  const { Text, Pressable } = require('react-native');
  return {
    Text,
    Button: ({ children, onPress }: any) => (
      <Pressable onPress={onPress}>
        <Text>{children}</Text>
      </Pressable>
    ),
    DefaultTheme: { colors: {}, fonts: {} },
  };
});

describe('LoginLink', () => {
  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur', () => {
    expect(() => render(<LoginLink />)).not.toThrow();
  });

  it('navigue vers Login quand on clique', () => {
    const { getByText } = render(<LoginLink />);
    fireEvent.press(getByText('Se connecter'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});
