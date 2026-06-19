import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_ID_KEY = 'matcha_analytics_session_id';

const createSessionId = () =>
  `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

export const getAnalyticsSessionId = async () => {
  const existing = await AsyncStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;

  const sessionId = createSessionId();
  await AsyncStorage.setItem(SESSION_ID_KEY, sessionId);
  return sessionId;
};
