import { changePasswordSchema } from '@/schemas/change-password';

describe('changePasswordSchema', () => {
  it('valide des données correctes', () => {
    const result = changePasswordSchema.safeParse({
      oldPassword: 'oldpass123',
      newPassword: 'Newpass123!',
      confirmNewPassword: 'Newpass123!',
    });
    expect(result.success).toBe(true);
  });

  it('échoue si oldPassword est vide', () => {
    const result = changePasswordSchema.safeParse({
      oldPassword: '',
      newPassword: 'Newpass123!',
      confirmNewPassword: 'Newpass123!',
    });
    expect(result.success).toBe(false);
  });

  it('échoue si les mots de passe ne correspondent pas', () => {
    const result = changePasswordSchema.safeParse({
      oldPassword: 'oldpass',
      newPassword: 'Newpass123!',
      confirmNewPassword: 'Different123!',
    });
    expect(result.success).toBe(false);
  });
});
