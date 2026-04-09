import { render } from '@testing-library/react-native';
import React from 'react';

import { Bubble } from '@/components/layout/Bubble';

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    useSharedValue: (val: number) => ({ value: val }),
    useAnimatedStyle: (fn: () => any) => fn(),
    withRepeat: (val: any) => val,
    withTiming: (val: number) => val,
  };
});

describe('Bubble', () => {
  it('se rend sans erreur', () => {
    expect(() =>
      render(<Bubble x={100} size={80} duration={5000} screenHeight={800} />),
    ).not.toThrow();
  });
});
