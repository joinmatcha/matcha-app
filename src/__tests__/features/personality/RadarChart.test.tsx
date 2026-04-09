import { render } from '@testing-library/react-native';
import React from 'react';

import RadarChart from '@/features/personality/components/RadarChart';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});
jest.mock('react-native-svg', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View {...props} />,
    Line: (props: any) => <View {...props} />,
    Polygon: (props: any) => <View {...props} />,
    Text: (props: any) => <Text {...props} />,
  };
});

const data = [
  { label: 'E/I', value: 0.7 },
  { label: 'S/N', value: 0.4 },
  { label: 'T/F', value: 0.8 },
  { label: 'J/P', value: 0.3 },
];

describe('RadarChart', () => {
  it('se rend sans erreur avec les données', () => {
    expect(() => render(<RadarChart data={data} />)).not.toThrow();
  });

  it('se rend avec une taille personnalisée', () => {
    expect(() => render(<RadarChart data={data} size={200} />)).not.toThrow();
  });
});
