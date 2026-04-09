import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import ForgotPasswordLink from '@/features/auth/components/ForgotPasswordLink';

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

describe('ForgotPasswordLink', () => {
  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur', () => {
    expect(() => render(<ForgotPasswordLink />)).not.toThrow();
  });

  it('navigue vers ForgotPassword quand on clique', () => {
    const { getByText } = render(<ForgotPasswordLink />);
    fireEvent.press(getByText('Cliquez ici'));
    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });
});
