import api from '@/api/api';

export type AnalyticsEventType =
  | 'test_started'
  | 'test_step_completed'
  | 'test_completed'
  | 'test_abandoned'
  | 'job_matched'
  | 'job_viewed'
  | 'job_swiped'
  | 'feedback_submitted';

export type AnalyticsEntityType =
  | 'personality'
  | 'bilan'
  | 'work_style'
  | 'job'
  | 'feedback';

export type AnalyticsEventPayload = {
  eventType: AnalyticsEventType;
  sessionId: string;
  source: 'mobile';
  entityType?: AnalyticsEntityType;
  entityId?: string;
  stepId?: string;
  metadata?: Record<string, unknown>;
  occurredAt?: string;
  appVersion?: string;
};

export const postAnalyticsEvent = async (payload: AnalyticsEventPayload) => {
  const response = await api.post('/api/analytics/events', payload);
  return response.data as {
    success: boolean;
    event: {
      id: string;
      eventType: AnalyticsEventType;
      receivedAt: string;
    };
  };
};
