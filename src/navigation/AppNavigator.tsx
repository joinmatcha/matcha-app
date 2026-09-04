import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NativeStackHeaderLeftProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import {
  BilanIntroScreen,
  BilanQuestionsScreen,
  BilanResultScreen,
} from '@/features/bilan';
import {
  CareerPreferencesScreen,
  MatchaProfileScreen,
  PricingPlansScreen,
} from '@/features/home';
import {
  JobCompareScreen,
  JobDetailScreen,
  JobMatchingScreen,
} from '@/features/jobs';
import {
  PersonalityIntroScreen,
  PersonalityResultScreen,
  PersonalityTestScreen,
} from '@/features/personality';
import { HelpSupportScreen } from '@/features/profile';
import {
  WorkStyleIntroScreen,
  WorkStyleQuestionsScreen,
  WorkStyleResultScreen,
} from '@/features/workStyle';
import { useAuth } from '@/hooks/useAuth';
import AuthStack from '@/navigation/AuthStack';
import StackBackButton from '@/navigation/StackBackButton';
import TabNavigator from '@/navigation/TabNavigator';
import Colors from '@/themes/colors';
import { RootStackParamList } from '@/types/navigation';
import { isPremiumSubscription } from '@/utils/subscription';

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
          Home: 'home',
          Swipe: 'swipe',
          Profil: 'profile',
        },
      },
      PersonalityIntro: 'personality-test',
      PersonalityTest: 'personality-questions',
      BilanIntro: 'professional-self-assessment',
      BilanQuestions: 'professional-self-assessment/questions',
      MatchaProfile: 'matcha-profile',
      PricingPlans: 'plans',
      JobMatching: 'job-matching',
      CareerPreferences: 'career-preferences',
      WorkStyleIntro: 'work-style',
      WorkStyleQuestions: 'work-style/questions',
      JobDetail: 'jobs/:jobId',
      HelpSupport: 'help',
    },
  },
};

const secondaryScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerTransparent: false,
  headerTitle: '',
  headerShadowVisible: true,
  headerStyle: {
    backgroundColor: '#FFFDF9',
  },
  headerTintColor: Colors.text.strong,
  headerLeft: (props: NativeStackHeaderLeftProps) => (
    <StackBackButton {...props} />
  ),
};

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const hasPremiumAccess = isPremiumSubscription(user?.subscription);

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
          <>
            <RootStack.Screen name="Main" component={TabNavigator} />
            <RootStack.Screen
              name="PersonalityIntro"
              component={PersonalityIntroScreen}
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="PersonalityTest"
              component={PersonalityTestScreen}
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="PersonalityResult"
              component={PersonalityResultScreen}
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="BilanIntro"
              component={
                hasPremiumAccess ? BilanIntroScreen : PricingPlansScreen
              }
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="BilanQuestions"
              component={
                hasPremiumAccess ? BilanQuestionsScreen : PricingPlansScreen
              }
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="BilanResult"
              component={
                hasPremiumAccess ? BilanResultScreen : PricingPlansScreen
              }
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="MatchaProfile"
              component={
                hasPremiumAccess ? MatchaProfileScreen : PricingPlansScreen
              }
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="PricingPlans"
              component={PricingPlansScreen}
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="JobMatching"
              component={
                hasPremiumAccess ? JobMatchingScreen : PricingPlansScreen
              }
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="CareerPreferences"
              component={CareerPreferencesScreen}
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="WorkStyleIntro"
              component={
                hasPremiumAccess ? WorkStyleIntroScreen : PricingPlansScreen
              }
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="WorkStyleQuestions"
              component={
                hasPremiumAccess ? WorkStyleQuestionsScreen : PricingPlansScreen
              }
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="WorkStyleResult"
              component={
                hasPremiumAccess ? WorkStyleResultScreen : PricingPlansScreen
              }
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="JobCompare"
              component={
                hasPremiumAccess ? JobCompareScreen : PricingPlansScreen
              }
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="JobDetail"
              component={JobDetailScreen}
              options={secondaryScreenOptions}
            />
            <RootStack.Screen
              name="HelpSupport"
              component={HelpSupportScreen}
              options={secondaryScreenOptions}
            />
          </>
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
