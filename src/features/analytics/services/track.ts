import {
  AnalyticsEntityType,
  AnalyticsEventType,
  postAnalyticsEvent,
} from '@/features/analytics/api/analyticsApi';
import { getAnalyticsSessionId } from '@/features/analytics/services/session';

export type TrackAnalyticsEventInput = {
  eventType: AnalyticsEventType;
  entityType?: AnalyticsEntityType;
  entityId?: string;
  stepId?: string;
  metadata?: Record<string, unknown>;
};

export const trackAnalyticsEvent = (input: TrackAnalyticsEventInput) => {
  void (async () => {
    try {
      const sessionId = await getAnalyticsSessionId();
      await postAnalyticsEvent({
        ...input,
        sessionId,
        source: 'mobile',
        occurredAt: new Date().toISOString(),
      });
    } catch {
      // Analytics must never block or disturb the user experience.
    }
  })();
};
