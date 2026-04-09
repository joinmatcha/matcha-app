import { render } from '@testing-library/react-native';
import React from 'react';

import BackgroundBubbles from '@/components/layout/BackgroundBubbles';

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

describe('BackgroundBubbles', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<BackgroundBubbles />)).not.toThrow();
  });
});
