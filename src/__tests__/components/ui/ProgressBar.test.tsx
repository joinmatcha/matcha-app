import { render } from '@testing-library/react-native';
import React from 'react';

import ProgressBar from '@/components/ui/ProgressBar';

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: (props: any) => <View {...props} testID="gradient" />,
  };
});
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    useSharedValue: (val: number) => ({ value: val }),
    useAnimatedStyle: (fn: () => any) => fn(),
    withTiming: (val: number) => val,
  };
});

describe('ProgressBar', () => {
  it('se rend sans erreur avec une valeur de 0', () => {
    expect(() => render(<ProgressBar value={0} />)).not.toThrow();
  });

  it('se rend sans erreur avec une valeur de 50', () => {
    expect(() => render(<ProgressBar value={50} />)).not.toThrow();
  });

  it('se rend sans erreur avec une valeur de 100', () => {
    expect(() => render(<ProgressBar value={100} />)).not.toThrow();
  });
});
