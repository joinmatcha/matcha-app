import { render } from '@testing-library/react-native';
import React from 'react';

import WorkStyleIntroScreen from '@/features/workStyle/screens/WorkStyleIntro';

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: (props: any) => <View {...props} /> };
});
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: undefined }),
}));

describe('WorkStyleIntroScreen', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<WorkStyleIntroScreen />)).not.toThrow();
  });
});
