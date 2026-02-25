import { z } from 'zod';

import { validateZod } from '@/utils/validation';

const schema = z.object({
  email: z.string().email('Email invalide'),
  age: z.number().min(18, 'Âge minimum 18 ans'),
});

describe('validateZod', () => {
  it('retourne valid: true et errors vide pour des données valides', () => {
    const result = validateZod(schema, { email: 'test@example.com', age: 25 });
    expect(result).toEqual({ valid: true, errors: {} });
  });

  it('retourne valid: false avec le champ en erreur pour un email invalide', () => {
    const result = validateZod(schema, { email: 'pas-un-email', age: 25 });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe('Email invalide');
  });

  it('retourne valid: false avec le champ en erreur pour un nombre trop petit', () => {
    const result = validateZod(schema, { email: 'test@example.com', age: 15 });
    expect(result.valid).toBe(false);
    expect(result.errors.age).toBe('Âge minimum 18 ans');
  });

  it('retourne les erreurs de plusieurs champs en même temps', () => {
    const result = validateZod(schema, { email: 'invalide', age: 10 });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.age).toBeDefined();
  });

  it('retourne valid: false si des champs requis sont absents', () => {
    const result = validateZod(schema, {});
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.age).toBeDefined();
  });
});
