import api from './api';

export type GrowthOutlook = 'stable' | 'growing' | 'declining' | 'unknown';

export interface JobListItem {
  id: string;
  title: string;
  sector?: string;
  description?: string;
  growthOutlook: GrowthOutlook;
  tags?: string[];
}

export interface JobDetail {
  id: string;

  title: string;
  description?: string;
  sector?: string;

  riasec: string[];

  competences: string[];
  softSkills: string[];
  values: string[];
  workConditions: string[];

  missions: string[];
  dailyTasks: string[];
  evolutionPaths: string[];

  salaryMin?: number;
  salaryMax?: number;

  growthOutlook: GrowthOutlook;
  tags: string[];
}

/**
 * GET /api/jobs
 * (liste simple)
 */
export const getJobs = async (params?: {
  q?: string;
  sector?: string;
  riasec?: string[];
  limit?: number;
}) => {
  const res = await api.get('/api/jobs', { params });
  return res.data as { jobs: JobListItem[] };
};

/**
 * GET /api/jobs/:id
 * (fiche métier complète)
 */
export const getJobById = async (jobId: string) => {
  const res = await api.get(`/api/job/${jobId}`);
  return res.data as { job: JobDetail };
};
