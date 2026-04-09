import { render } from '@testing-library/react-native';
import React from 'react';

import GoogleAuth from '@/features/auth/components/GoogleAuth';

jest.mock('react-native-paper', () => {
  const { Text, View } = require('react-native');
  return {
    Text,
    Button: ({ children, ...rest }: any) => <View {...rest}>{children}</View>,
    DefaultTheme: { colors: {}, fonts: {} },
  };
});
jest.mock('@/assets', () => ({
  Images: { GoogleLogo: 1 },
}));

describe('GoogleAuth', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<GoogleAuth />)).not.toThrow();
  });

  it('affiche le texte du bouton Google', () => {
    const { getByText } = render(<GoogleAuth />);
    expect(getByText("S'inscrire via Google")).toBeTruthy();
  });
});
