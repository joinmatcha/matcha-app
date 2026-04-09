import { render } from '@testing-library/react-native';
import React from 'react';

import DatePickerInput from '@/components/ui/DatePickerInput';

jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View testID="date-picker" {...props} />,
  };
});
jest.mock('react-native-paper', () => {
  const { Text, View } = require('react-native');
  return {
    TextInput: Object.assign(
      ({ label, value, ...rest }: any) => (
        <View {...rest}>
          <Text>{label}</Text>
          <Text testID="display-value">{value}</Text>
        </View>
      ),
      { Icon: () => null },
    ),
    DefaultTheme: { colors: {}, fonts: {} },
  };
});

describe('DatePickerInput', () => {
  const onChange = jest.fn();

  it('se rend sans erreur sans valeur', () => {
    expect(() =>
      render(<DatePickerInput label="Date" value={null} onChange={onChange} />),
    ).not.toThrow();
  });

  it('se rend sans erreur avec une date', () => {
    const date = new Date(2000, 5, 15);
    expect(() =>
      render(<DatePickerInput label="Date" value={date} onChange={onChange} />),
    ).not.toThrow();
  });

  it('affiche la date formatée', () => {
    const date = new Date(2000, 0, 5);
    const { getByTestId } = render(
      <DatePickerInput label="Date" value={date} onChange={onChange} />,
    );
    expect(getByTestId('display-value').props.children).toBe('05/01/2000');
  });
});
