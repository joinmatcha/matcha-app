import axios from 'axios';

export const getApiErrorStatus = (error: unknown): number | undefined => {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Problème de connexion. Vérifie ton réseau et réessaie.';
    }

    const apiMessage =
      (error.response.data as { message?: string; error?: string })?.message ||
      (error.response.data as { message?: string; error?: string })?.error;

    if (typeof apiMessage === 'string' && apiMessage.length > 0) {
      return apiMessage;
    }
  }

  return fallback;
};
