import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { sendSupportContact } from '@/features/profile/api/profileApi';
import HelpSupportScreen from '@/features/profile/screens/HelpSupport';

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    useSharedValue: (v: number) => ({ value: v }),
    useAnimatedStyle: (fn: () => any) => fn(),
    withRepeat: (v: any) => v,
    withTiming: (v: number) => v,
  };
});
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: (props: any) => <View {...props} /> };
});
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));
jest.mock('@/features/profile/api/profileApi', () => ({
  sendSupportContact: jest.fn().mockResolvedValue({}),
}));

describe('HelpSupportScreen', () => {
  it('affiche les contenus principaux', () => {
    const { getByText } = render(<HelpSupportScreen />);

    expect(getByText('Comment peut-on t’aider ?')).toBeTruthy();
    expect(getByText('Questions fréquentes')).toBeTruthy();
    expect(getByText('Conditions d’utilisation')).toBeTruthy();
    expect(getByText('Contacter le support')).toBeTruthy();
  });

  it('envoie une demande de support valide', async () => {
    const { getByPlaceholderText, getByText } = render(<HelpSupportScreen />);

    fireEvent.press(getByText('Bug'));
    fireEvent.changeText(getByPlaceholderText('Sujet'), 'Problème de test');
    fireEvent.changeText(
      getByPlaceholderText('Décris ta demande'),
      'Le formulaire ne fonctionne pas correctement sur mon compte.',
    );
    fireEvent.press(getByText('Envoyer'));

    await waitFor(() => {
      expect(sendSupportContact).toHaveBeenCalledWith({
        category: 'bug',
        subject: 'Problème de test',
        message: 'Le formulaire ne fonctionne pas correctement sur mon compte.',
      });
    });
  });
});
