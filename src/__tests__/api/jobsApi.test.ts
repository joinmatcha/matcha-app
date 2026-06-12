import api from '@/api/api';
import {
  compareJobs,
  getJobById,
  getJobs,
  getTopLikedJobs,
} from '@/features/jobs/api/jobsApi';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/api/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('jobsApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getJobs appelle GET /api/jobs sans params', async () => {
    mockedApi.get.mockResolvedValue({ data: { jobs: [] } });

    const result = await getJobs();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/jobs', {
      params: undefined,
    });
    expect(result).toEqual({ jobs: [] });
  });

  it('getJobs passe les params de recherche', async () => {
    const params = { q: 'dev', sector: 'tech', riasec: 'RIASEC_I', limit: 10 };
    mockedApi.get.mockResolvedValue({ data: { jobs: [{ id: '1' }] } });

    const result = await getJobs(params);

    expect(mockedApi.get).toHaveBeenCalledWith('/api/jobs', { params });
    expect(result.jobs).toHaveLength(1);
  });

  it('getJobById appelle GET /api/jobs/:id', async () => {
    mockedApi.get.mockResolvedValue({
      data: { job: { id: 'j1', title: 'Dev' } },
    });

    const result = await getJobById('j1');

    expect(mockedApi.get).toHaveBeenCalledWith('/api/jobs/j1');
    expect(result.job.title).toBe('Dev');
  });

  it('getTopLikedJobs appelle GET /api/jobs/top-liked avec limit', async () => {
    mockedApi.get.mockResolvedValue({ data: { jobs: [] } });

    const result = await getTopLikedJobs(3);

    expect(mockedApi.get).toHaveBeenCalledWith('/api/jobs/top-liked', {
      params: { limit: 3 },
    });
    expect(result).toEqual({ jobs: [] });
  });

  it('compareJobs appelle POST /api/jobs/compare avec les ids', async () => {
    mockedApi.post.mockResolvedValue({
      data: { jobs: [], context: { bilanId: 'b1' } },
    });

    const result = await compareJobs(['j1', 'j2']);

    expect(mockedApi.post).toHaveBeenCalledWith('/api/jobs/compare', {
      jobIds: ['j1', 'j2'],
    });
    expect(result.jobs).toEqual([]);
  });
});
