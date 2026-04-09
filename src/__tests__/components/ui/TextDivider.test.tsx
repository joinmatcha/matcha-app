import { render } from '@testing-library/react-native';
import React from 'react';

import TextDivider from '@/components/ui/TextDivider';

jest.mock('react-native-paper', () => {
  const { Text, View } = require('react-native');
  return {
    Text,
    Divider: (props: any) => <View {...props} testID="divider" />,
    DefaultTheme: { colors: {}, fonts: {} },
  };
});

describe('TextDivider', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<TextDivider text="ou" />)).not.toThrow();
  });

  it('affiche le texte passé en props', () => {
    const { getByText } = render(<TextDivider text="ou" />);
    expect(getByText('ou')).toBeTruthy();
  });
});
