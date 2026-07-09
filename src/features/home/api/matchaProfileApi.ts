import api from '@/api/api';

export type MatchaProfileRoute =
  | 'BilanIntro'
  | 'PersonalityIntro'
  | 'WorkStyleIntro'
  | 'JobCompare'
  | 'CareerPreferences';

export type MatchaProfileSignal = {
  label: string;
  sources: string[];
  weight: number;
};

export type MatchaProfileJob = {
  id: string;
  title: string;
  sector?: string;
  description?: string;
  score?: number;
  likesCount?: number;
};

export type MatchaProfileTestCard = {
  key: 'bilan' | 'personality' | 'work_style';
  label: string;
  title: string;
  description: string;
  completed: boolean;
};

export type MatchaProfileNextAction = {
  type:
    | 'start_bilan'
    | 'start_personality'
    | 'start_work_style'
    | 'compare_jobs'
    | 'view_liked_jobs';
  label: string;
  route: MatchaProfileRoute;
  jobIds?: string[];
};

export type MatchaProfileSummary = {
  completion: number;
  mainProfile: {
    title: string;
    summary: string;
  };
  completedTests: {
    total: number;
    bilan: boolean;
    personality: boolean;
    workStyle: boolean;
  };
  strongSignals: MatchaProfileSignal[];
  keyDimensions: {
    strengths: string[];
    values: string[];
    environments: string[];
    sectors: string[];
  };
  tests: MatchaProfileTestCard[];
  recommendedJobs: MatchaProfileJob[];
  likedJobs: MatchaProfileJob[];
  nextBestAction: MatchaProfileNextAction;
};

export async function getMatchaProfile() {
  const response = await api.get('/api/matcha-profile/me');
  return response.data as { profile: MatchaProfileSummary };
}
