import api from './api';

export type BilanQuestionType = 'likert_1_5' | 'open_text';

export interface BilanQuestion {
  code: string;
  question: string;
  type: BilanQuestionType;
  domain: string;
  subdomain: string;
}

export interface BilanAnswersPayload {
  questionCode: string;
  valueNumber?: number;
  valueText?: string;
}

export interface BilanArchetype {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface BilanRecommendedJob {
  id: string;
  title: string;
  description?: string;
  sector?: string;
  score: number;
}

export interface BilanConclusion {
  archetype: BilanArchetype;
  profileSummary: string;
  keyStrengths: string[];
  improvementAxes: string[];
  recommendedEnvironments: string[];
  recommendedJobs: BilanRecommendedJob[];
  actionPlan: string[];
}

export interface BilanInvestigation {
  topValues: string[];
  topWorkConditions: string[];
  interestsProfile: string[];
}

export interface BilanResult {
  id: string;
  version: number;
  createdAt: string;
  conclusion: BilanConclusion;
  investigation: BilanInvestigation;
}

export const getBilanQuestions = async () => {
  const res = await api.get('/api/bilan/questions');
  return res.data as {
    version: number;
    questions: BilanQuestion[];
  };
};

export const postBilanAnswers = async (
  version: number,
  answers: BilanAnswersPayload[],
) => {
  const res = await api.post('/api/bilan/answers', { version, answers });
  return res.data;
};

export const generateBilan = async (version: number) => {
  const res = await api.post('/api/bilan/generate', { version });
  return res.data as { bilan: BilanResult };
};

export const getMyBilan = async () => {
  const res = await api.get('/api/bilan/me');
  return res.data as { bilan: BilanResult | null };
};
