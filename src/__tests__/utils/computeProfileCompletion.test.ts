import { UserFull } from '@/types/user';
import { computeProfileCompletion } from '@/utils/computeProfileCompletion';

const baseUser: UserFull = {
  id: '1',
  email: 'test@example.com',
  firstName: '',
  lastName: '',
  isEmailVerified: false,
  consentAccepted: false,
  subscription: 'free',
};

describe('computeProfileCompletion', () => {
  it('retourne 0% quand tous les champs sont absents', () => {
    expect(computeProfileCompletion(baseUser)).toBe(0);
  });

  it('retourne 100% quand tous les champs sont remplis', () => {
    const user: UserFull = {
      ...baseUser,
      firstName: 'Jean',
      lastName: 'Dupont',
      addressCity: 'Paris',
      locationPref: 'remote',
      isEmailVerified: true,
      jobTypes: ['CDI'],
      birthYear: 1995,
    };
    expect(computeProfileCompletion(user)).toBe(100);
  });

  it('retourne 17% avec uniquement le nom et prénom (1/6)', () => {
    const user: UserFull = {
      ...baseUser,
      firstName: 'Jean',
      lastName: 'Dupont',
    };
    expect(computeProfileCompletion(user)).toBe(17);
  });

  it('retourne 50% avec 3 champs remplis (3/6)', () => {
    const user: UserFull = {
      ...baseUser,
      firstName: 'Jean',
      lastName: 'Dupont',
      addressCity: 'Paris',
      isEmailVerified: true,
    };
    expect(computeProfileCompletion(user)).toBe(50);
  });

  it('ne compte pas le nom si le prénom est vide', () => {
    const user: UserFull = { ...baseUser, firstName: '', lastName: 'Dupont' };
    expect(computeProfileCompletion(user)).toBe(0);
  });

  it('ne compte pas le prénom si le nom est vide', () => {
    const user: UserFull = { ...baseUser, firstName: 'Jean', lastName: '' };
    expect(computeProfileCompletion(user)).toBe(0);
  });

  it('ne compte pas isEmailVerified si false', () => {
    const user: UserFull = {
      ...baseUser,
      firstName: 'Jean',
      lastName: 'Dupont',
      isEmailVerified: false,
    };
    expect(computeProfileCompletion(user)).toBe(17);
  });
});
