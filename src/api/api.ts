import axios from 'axios';

import { API_URL } from '@/constants/config';
import { logger } from '@/utils/logger';
import { getToken } from '@/utils/storage';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.metadata = { startedAt: Date.now() };
  logger.debug('api_request_started', {
    method: config.method?.toUpperCase(),
    url: config.url,
  });
  return config;
});

instance.interceptors.response.use(
  (response) => {
    const startedAt = response.config.metadata?.startedAt;
    logger.debug('api_request_completed', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      durationMs: startedAt ? Date.now() - startedAt : undefined,
      requestId: response.headers?.['x-request-id'],
    });

    return response;
  },
  (error) => {
    const config = error.config ?? {};
    const startedAt = config.metadata?.startedAt;
    const status = error.response?.status;
    const requestId = error.response?.headers?.['x-request-id'];

    logger[status && status < 500 ? 'warn' : 'error']('api_request_failed', {
      method: config.method?.toUpperCase(),
      url: config.url,
      status,
      durationMs: startedAt ? Date.now() - startedAt : undefined,
      requestId,
      message: error.message,
    });

    return Promise.reject(error);
  },
);

export default instance;
