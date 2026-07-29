import api from '@/api/api';

export type JobMatchingDecision = 'like' | 'dislike' | null;

export type JobMatchingJob = {
  id: string;
  code: string;
  title: string;
  sector?: string;
  score: number;
  reasons: string[];
  decision: JobMatchingDecision;
};

export type JobMatchingResponse = {
  unlocked: boolean;
  missingTests: string[];
  sectors: Array<{
    key: string;
    label: string;
    weight: number;
    sources: string[];
  }>;
  total: number;
  remaining: number;
  completed: boolean;
  jobs: JobMatchingJob[];
  likedJobs: JobMatchingJob[];
  dislikedJobs: JobMatchingJob[];
};

export async function getJobMatching() {
  const response = await api.get('/api/jobs/matching');
  return response.data as JobMatchingResponse;
}

export async function decideJobMatching(
  jobId: string,
  action: Exclude<JobMatchingDecision, null>,
) {
  const response = await api.post('/api/jobs/matching/decision', {
    jobId,
    action,
  });
  return response.data as JobMatchingResponse;
}

export async function resetJobMatching() {
  const response = await api.delete('/api/jobs/matching/reset');
  return response.data as JobMatchingResponse;
}
