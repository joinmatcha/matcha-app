import { NavigatorScreenParams } from '@react-navigation/native';

import { BilanResult } from '@/features/bilan/api/bilanApi';
import { PersonalityResult } from '@/features/personality/api/personalityApi';
import { PersonalitySummary } from '@/types/user';

export type BilanIntroMode = 'start' | 'restart' | 'resume';

export type AuthStackParamList = {
  Login: undefined;
  Signin: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type HomeStackParamList = {
  HomeMain: undefined;

  PersonalityIntro: { hasDraft?: boolean } | undefined;
  PersonalityTest: undefined;
  PersonalityResult: {
    result: PersonalityResult | PersonalitySummary;
  };

  BilanIntro: { mode?: BilanIntroMode } | undefined;
  BilanQuestions: undefined;
  BilanResult: {
    bilan: BilanResult;
  };
  JobDetail: { jobId: string };
};

export type TabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Swipe: undefined;
  Profil: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};
