import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import SigninLink from '@/features/auth/components/SigninLink';

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

describe('SigninLink', () => {
  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur', () => {
    expect(() => render(<SigninLink />)).not.toThrow();
  });

  it('navigue vers Signin quand on clique', () => {
    const { getByText } = render(<SigninLink />);
    fireEvent.press(getByText("S'inscrire"));
    expect(mockNavigate).toHaveBeenCalledWith('Signin');
  });
});
