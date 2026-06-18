import api from '@/api/api';
import { postAnalyticsEvent } from '@/features/analytics/api/analyticsApi';

jest.mock('@/api/api', () => ({
  post: jest.fn(),
}));

describe('analyticsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envoie un événement analytics', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        event: {
          id: 'evt1',
          eventType: 'test_started',
          receivedAt: '2026-06-16T10:00:00.000Z',
        },
      },
    });

    const response = await postAnalyticsEvent({
      eventType: 'test_started',
      sessionId: 'session-1',
      source: 'mobile',
      entityType: 'personality',
      entityId: 'personality-v1',
    });

    expect(api.post).toHaveBeenCalledWith('/api/analytics/events', {
      eventType: 'test_started',
      sessionId: 'session-1',
      source: 'mobile',
      entityType: 'personality',
      entityId: 'personality-v1',
    });
    expect(response.success).toBe(true);
  });
});
