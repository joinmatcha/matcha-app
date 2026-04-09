import { newPasswordSchema } from '@/schemas/password-reset';

describe('newPasswordSchema', () => {
  it('valide des données correctes', () => {
    const result = newPasswordSchema.safeParse({
      password: 'Newpass123!',
      confirm: 'Newpass123!',
    });
    expect(result.success).toBe(true);
  });

  it('échoue si les mots de passe ne correspondent pas', () => {
    const result = newPasswordSchema.safeParse({
      password: 'Newpass123!',
      confirm: 'Different123!',
    });
    expect(result.success).toBe(false);
  });
});
