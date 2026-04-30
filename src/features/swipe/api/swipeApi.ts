import api from '@/api/api';

export interface DeckJob {
  id: string;
  code: string;
  title: string;
  sector?: string;
  description?: string;
  growthOutlook: 'unknown';
  tags: string[];
  riasec: string[];
}

export interface DeckResponse {
  jobs: DeckJob[];
  remaining: number;
  limit: number;
}

export interface SwipeResponse {
  swipe: {
    id: string;
    jobId: string;
    action: 'like' | 'dislike';
    swipedAt: string;
  };
  remaining: number;
  limit: number;
}

export const getDeck = async (limit?: number): Promise<DeckResponse> => {
  const res = await api.get('/api/jobs/deck', { params: { limit } });
  return res.data as DeckResponse;
};

export const postSwipe = async (
  jobId: string,
  action: 'like' | 'dislike',
): Promise<SwipeResponse> => {
  const res = await api.post('/api/jobs/swipe', { jobId, action });
  return res.data as SwipeResponse;
};
