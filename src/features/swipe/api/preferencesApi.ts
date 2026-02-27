import api from '@/api/api';

export interface Preferences {
  totalLikes: number;
  totalDislikes: number;
  topSectors: { key: string; score: number }[];
  topCompetences: { key: string; score: number }[];
  topTags: { key: string; score: number }[];
  topWorkConditions: { key: string; score: number }[];
  recentLikes: { id: string; title: string; sector: string }[];
}

export const getPreferences = async (): Promise<Preferences> => {
  const res = await api.get('/api/users/me/preferences');
  return res.data.preferences as Preferences;
};
