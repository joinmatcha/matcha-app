import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import BackgroundRadial from '@/components/layout/BackgroundRadial';

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});
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

describe('BackgroundRadial', () => {
  it('se rend sans erreur avec les props par défaut', () => {
    expect(() => render(<BackgroundRadial />)).not.toThrow();
  });

  it('se rend avec des enfants', () => {
    const { getByText } = render(
      <BackgroundRadial>
        <Text>Contenu</Text>
      </BackgroundRadial>,
    );
    expect(getByText('Contenu')).toBeTruthy();
  });

  it('se rend avec le variant green', () => {
    expect(() => render(<BackgroundRadial variant="green" />)).not.toThrow();
  });

  it('se rend avec le variant beige', () => {
    expect(() => render(<BackgroundRadial variant="beige" />)).not.toThrow();
  });

  it('se rend avec les bulles activées', () => {
    expect(() => render(<BackgroundRadial bubbles={true} />)).not.toThrow();
  });
});
