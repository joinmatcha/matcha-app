import { NavigatorScreenParams } from '@react-navigation/native';

import { BilanResult } from '@/features/bilan/api/bilanApi';
import { PersonalityResult } from '@/features/personality/api/personalityApi';
import { WorkStyleResult } from '@/features/workStyle/api/workStyleApi';
import { PersonalitySummary } from '@/types/user';

export type BilanIntroMode = 'start' | 'restart' | 'resume';

export type AuthStackParamList = {
  Login: { registeredEmail?: string } | undefined;
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
  MatchaProfile: undefined;
  JobMatching: undefined;
  CareerPreferences: undefined;
  JobDetail: { jobId: string };
  JobCompare: { jobIds: string[] };
  WorkStyleIntro: { hasDraft?: boolean } | undefined;
  WorkStyleQuestions: undefined;
  WorkStyleResult: { result: WorkStyleResult };
};

export type TabParamList = {
  Home: undefined;
  Swipe: undefined;
  Profil: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
  HelpSupport: undefined;
} & Omit<HomeStackParamList, 'HomeMain'>;
