import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import * as React from 'react';
import { PaperProvider } from 'react-native-paper';

import { AuthProvider } from '@/contexts/AuthContext';
import AppNavigator from '@/navigation/AppNavigator';
import rnpTheme from '@/themes/rnpTheme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Outfit_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={rnpTheme}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
