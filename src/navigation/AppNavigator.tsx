import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import AuthStack from '@/navigation/AuthStack';
import TabNavigator from '@/navigation/TabNavigator';
import { RootStackParamList } from '@/types/navigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'matcha://', 'exp://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Signin: 'signin',
          ForgotPassword: 'forgot-password',
          ResetPassword: {
            path: 'reset-password',
            parse: {
              token: (token: string) => token,
            },
          },
        },
      },
      Main: {
        screens: {
          Home: {
            screens: {
              HomeMain: 'home',
              PersonalityTest: 'personality-test',
            },
          },
          Swipe: 'swipe',
          Profil: 'profile',
          Deconnexion: 'logout',
        },
      },
    },
  },
};

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer<RootStackParamList> linking={linking}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="Main" component={TabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
