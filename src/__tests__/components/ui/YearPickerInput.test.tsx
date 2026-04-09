import { render } from '@testing-library/react-native';
import React from 'react';

import YearPickerInput from '@/components/ui/YearPickerInput';

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

describe('YearPickerInput', () => {
  const onChange = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur sans valeur', () => {
    expect(() =>
      render(
        <YearPickerInput label="Année" value={null} onChange={onChange} />,
      ),
    ).not.toThrow();
  });

  it('se rend sans erreur avec une date', () => {
    const date = new Date(2000, 0, 1);
    expect(() =>
      render(
        <YearPickerInput label="Année" value={date} onChange={onChange} />,
      ),
    ).not.toThrow();
  });
});
