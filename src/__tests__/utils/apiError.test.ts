import { AxiosError, AxiosHeaders } from 'axios';

import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiError';

const makeAxiosError = (status?: number, data?: unknown): AxiosError => {
  const error = new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    undefined,
    undefined,
    status
      ? {
          status,
          data,
          statusText: 'Error',
          headers: {},
          config: { headers: new AxiosHeaders() },
        }
      : undefined,
  );
  return error;
};

describe('getApiErrorStatus', () => {
  it('retourne le status HTTP pour une erreur Axios avec réponse', () => {
    const error = makeAxiosError(422, {});
    expect(getApiErrorStatus(error)).toBe(422);
  });

  it('retourne undefined pour une erreur Axios sans réponse (réseau)', () => {
    const error = makeAxiosError();
    expect(getApiErrorStatus(error)).toBeUndefined();
  });

  it('retourne undefined pour une erreur non-Axios', () => {
    expect(getApiErrorStatus(new Error('oops'))).toBeUndefined();
  });

  it('retourne undefined pour une valeur non-Error', () => {
    expect(getApiErrorStatus('string')).toBeUndefined();
    expect(getApiErrorStatus(null)).toBeUndefined();
  });
});

describe('getApiErrorMessage', () => {
  it("retourne le message de connexion quand il n'y a pas de réponse", () => {
    const error = makeAxiosError();
    expect(getApiErrorMessage(error, 'fallback')).toBe(
      'Problème de connexion. Vérifie ton réseau et réessaie.',
    );
  });

  it('retourne le champ message de la réponse API', () => {
    const error = makeAxiosError(400, { message: 'Email déjà utilisé' });
    expect(getApiErrorMessage(error, 'fallback')).toBe('Email déjà utilisé');
  });

  it('retourne le champ error de la réponse API si pas de message', () => {
    const error = makeAxiosError(400, { error: 'Validation échouée' });
    expect(getApiErrorMessage(error, 'fallback')).toBe('Validation échouée');
  });

  it("retourne le fallback si la réponse API n'a ni message ni error", () => {
    const error = makeAxiosError(500, { code: 'INTERNAL' });
    expect(getApiErrorMessage(error, 'Erreur inconnue')).toBe(
      'Erreur inconnue',
    );
  });

  it('retourne le fallback si le message API est vide', () => {
    const error = makeAxiosError(400, { message: '' });
    expect(getApiErrorMessage(error, 'fallback')).toBe('fallback');
  });

  it('retourne le fallback pour une erreur non-Axios', () => {
    expect(getApiErrorMessage(new Error('boom'), 'fallback')).toBe('fallback');
  });
});
