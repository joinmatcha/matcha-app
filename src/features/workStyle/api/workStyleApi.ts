import api from '@/api/api';

export type WorkStyleDimension =
  | 'autonomy'
  | 'collaboration'
  | 'pace'
  | 'structure'
  | 'variety'
  | 'human_contact'
  | 'mobility'
  | 'learning';

export type WorkStyleQuestion = {
  id: string;
  text: string;
  dimension: WorkStyleDimension;
  polarity: 1 | -1;
  order: number;
};

export type WorkStyleProfile = {
  key: string;
  title: string;
  description: string;
  strengths: string[];
  cautions: string[];
  advice: string[];
};

export type WorkStyleResult = {
  id: string;
  version: number;
  scores: Record<WorkStyleDimension, number>;
  topAxes: WorkStyleDimension[];
  topAxisLabels: string[];
  profile: WorkStyleProfile;
  createdAt?: string;
};

export type WorkStyleTemplate = {
  _id: string;
  version: number;
  title: string;
  summary?: string;
  questions: WorkStyleQuestion[];
};

export type WorkStyleStatus = {
  completed: boolean;
  latestResult: WorkStyleResult | null;
  test: WorkStyleTemplate;
};

export type WorkStyleAnswer = {
  questionId: string;
  value: number;
};

export const getActiveWorkStyleTest = async () => {
  const response = await api.get('/api/work-style/active');
  return response.data as WorkStyleStatus;
};

export const getMyWorkStyle = async () => {
  const response = await api.get('/api/work-style/me');
  return response.data as {
    latestResult: WorkStyleResult | null;
    history: WorkStyleResult[];
  };
};

export const submitWorkStyleTest = async (answers: WorkStyleAnswer[]) => {
  const response = await api.post('/api/work-style/submit', { answers });
  return response.data.result as WorkStyleResult;
};

export const resetWorkStyleTest = async (): Promise<void> => {
  await api.post('/api/work-style/reset');
};
