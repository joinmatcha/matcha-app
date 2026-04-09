import { render } from '@testing-library/react-native';
import React from 'react';

import BottomSheetSelect from '@/components/ui/BottomSheetSelect';

jest.mock('react-native-paper', () => {
  const { Text, View } = require('react-native');
  return {
    Text,
    Button: ({ children, onPress, ...rest }: any) => (
      <Text {...rest} onPress={onPress}>
        {children}
      </Text>
    ),
    TextInput: ({ label, value, ...rest }: any) => (
      <View {...rest}>
        <Text>{label}</Text>
        <Text>{value}</Text>
      </View>
    ),
    DefaultTheme: { colors: {}, fonts: {} },
  };
});

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

describe('BottomSheetSelect', () => {
  const onChange = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur', () => {
    expect(() =>
      render(
        <BottomSheetSelect
          label="Choix"
          value={null}
          options={options}
          onChange={onChange}
        />,
      ),
    ).not.toThrow();
  });

  it("affiche le placeholder quand aucune valeur n'est sélectionnée", () => {
    const { getByText } = render(
      <BottomSheetSelect
        label="Choix"
        value={null}
        options={options}
        placeholder="Choisir..."
        onChange={onChange}
      />,
    );
    expect(getByText('Choisir...')).toBeTruthy();
  });

  it("affiche le label de l'option sélectionnée", () => {
    const { getByText } = render(
      <BottomSheetSelect
        label="Choix"
        value="b"
        options={options}
        onChange={onChange}
      />,
    );
    expect(getByText('Option B')).toBeTruthy();
  });
});
