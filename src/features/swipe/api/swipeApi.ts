import api from '@/api/api';

export interface DeckJob {
  id: string;
  title: string;
  description?: string;
  sector?: string;
  tags: string[];
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

export const getDeck = async (): Promise<DeckResponse> => {
  const res = await api.get('/api/jobs/deck');
  return res.data as DeckResponse;
};

export const postSwipe = async (
  jobId: string,
  action: 'like' | 'dislike',
): Promise<SwipeResponse> => {
  const res = await api.post('/api/jobs/swipe', { jobId, action });
  return res.data as SwipeResponse;
};
