import { render } from '@testing-library/react-native';
import React from 'react';

import ProfileCompletionCard from '@/features/home/components/ProfileCompletionCard';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});
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
    withTiming: (val: number) => val,
  };
});

describe('ProfileCompletionCard', () => {
  const onPress = jest.fn();

  it('affiche la carte quand completion < 100', () => {
    const { getByText } = render(
      <ProfileCompletionCard completion={60} onPress={onPress} />,
    );
    expect(getByText('Profil complété à 60%')).toBeTruthy();
  });

  it('ne rend rien quand completion >= 100', () => {
    const { toJSON } = render(
      <ProfileCompletionCard completion={100} onPress={onPress} />,
    );
    expect(toJSON()).toBeNull();
  });
});
