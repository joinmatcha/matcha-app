import api from '@/api/api';

export type GrowthOutlook = 'unknown';

export type RiasecLabel = {
  code: string;
  label: string;
};

export type RomeLabelCode = {
  code?: string;
  label?: string;
};

export type RomeAppellation = {
  code: string;
  label: string;
  shortLabel?: string;
  classification?: string;
  isMain?: boolean;
};

export type RomeSkill = {
  code?: string;
  label: string;
  type?: string;
  riasecMajor?: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  riasecMinor?: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  isMain?: boolean;
  source?: 'metier' | 'fiche';
  group?: RomeLabelCode;
};

export type RomeSkillGroup = {
  group?: RomeLabelCode;
  skills: Array<Omit<RomeSkill, 'isMain' | 'source' | 'group'>>;
};

export type RomeKnowledge = {
  code?: string;
  label: string;
  category?: RomeLabelCode;
};

export type RomeKnowledgeGroup = {
  category?: RomeLabelCode;
  knowledge: Array<{
    code?: string;
    label: string;
    type?: string;
  }>;
};

export type RomeWorkContext = {
  code?: string;
  label: string;
  category?: string;
};

export type RomeInterest = {
  code?: string;
  label?: string;
  isMain?: boolean;
};

export type RomeRelatedJob = {
  code?: string;
  label?: string;
  relation: 'close' | 'possible';
};

export type MarketIndicatorValue = {
  code?: string;
  label?: string;
  periodCode?: string;
  periodLabel?: string;
  name?: string;
  count?: number;
  amount?: number;
  rate?: number;
  decimal?: number;
  rank?: number;
  percentage?: number;
  secondaryCount?: number;
  secondaryPercentage?: number;
  secondaryRate?: number;
};

export type MarketIndicatorSnapshot = {
  code?: string;
  family?: string;
  label?: string;
  updatedAt?: string;
  periodCode?: string;
  periodLabel?: string;
  mainName?: string;
  values: MarketIndicatorValue[];
};

export type JobMarket = {
  territory: {
    type: string;
    code: string;
    label?: string;
  };
  salary?: MarketIndicatorSnapshot;
  offers?: MarketIndicatorSnapshot;
  hires?: MarketIndicatorSnapshot;
  demanders?: MarketIndicatorSnapshot;
  tension?: MarketIndicatorSnapshot;
  lastSyncedAt?: string;
};

export type WorkStyleCompatibility = {
  level: 'high' | 'medium' | 'low';
  label: string;
  reasons: string[];
};

export interface JobSummary {
  id: string;
  code: string;
  title: string;
  sector?: string;
  description?: string;
  growthOutlook: GrowthOutlook;
  tags: string[];
  riasec: string[];
}

export type JobListItem = JobSummary;

export type JobDetail = Omit<JobSummary, 'riasec'> & {
  definition?: string;
  accessToJob?: string;
  domain?: {
    code?: string;
    label?: string;
    grandDomain?: RomeLabelCode;
  };
  riasec: Array<RiasecLabel | string>;
  appellations: RomeAppellation[];
  skills: RomeSkill[];
  skillGroups: RomeSkillGroup[];
  knowledge: RomeKnowledge[];
  knowledgeGroups: RomeKnowledgeGroup[];
  workContexts: RomeWorkContext[];
  themes: RomeLabelCode[];
  interests: RomeInterest[];
  trainingCodes: RomeLabelCode[];
  sectors: RomeLabelCode[];
  relatedJobs: RomeRelatedJob[];
  transitions?: {
    ecological?: boolean;
    digital?: boolean;
    demographic?: boolean;
    ecologicalDetail?: string;
  };
  isExecutive?: boolean;
  isRegulated?: boolean;
  market: JobMarket | null;
  workStyleCompatibility?: WorkStyleCompatibility | null;
  lastSyncedAt?: string;
};

export interface RecommendedJob {
  id: string;
  title: string;
  description?: string;
  sector?: string;
  score: number;
  reasons?: string[];
}

export type TopLikedJob = JobSummary & {
  likesCount: number;
  lastLikedAt: string;
};

export interface ComparedJob {
  id: string;
  code: string;
  title: string;
  sector?: string;
  description?: string;
  matchScore: number;
  matchReasons: string[];
  riasec: string[];
  matchedInterests: string[];
  matchedSkills: string[];
  skillsToDevelop: string[];
  matchedWorkConditions: string[];
  workContexts: string[];
  accessToJob?: string;
  isRegulated?: boolean;
  isExecutive?: boolean;
  market: JobMarket | null;
  workStyleCompatibility?: WorkStyleCompatibility | null;
  recommendedNextStep: string;
}

export interface JobComparison {
  jobs: ComparedJob[];
  context: {
    bilanId: string;
    bilanVersion: number;
    interestsProfile: string[];
    strengths: string[];
    workConditions: string[];
  };
}

/**
 * GET /api/jobs
 * (liste simple)
 */
export const getJobs = async (params?: {
  q?: string;
  sector?: string;
  riasec?: string;
  limit?: number;
}) => {
  const res = await api.get('/api/jobs', { params });
  return res.data as { jobs: JobSummary[] };
};

/**
 * GET /api/jobs/:id
 * (fiche métier complète)
 */
export const getJobById = async (jobId: string) => {
  const res = await api.get(`/api/jobs/${jobId}`);
  return res.data as { job: JobDetail; recommendation?: RecommendedJob | null };
};

/**
 * GET /api/jobs/recommended
 */
export const getRecommendedJobs = async () => {
  const res = await api.get('/api/jobs/recommended');
  return res.data as { jobs: RecommendedJob[] };
};

/**
 * GET /api/jobs/top-liked
 */
export const getTopLikedJobs = async (limit = 3) => {
  const res = await api.get('/api/jobs/top-liked', { params: { limit } });
  return res.data as { jobs: TopLikedJob[] };
};

/**
 * POST /api/jobs/compare
 */
export const compareJobs = async (jobIds: string[]) => {
  const res = await api.post('/api/jobs/compare', { jobIds });
  return res.data as JobComparison;
};
