import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Draft,
  clearDraft,
  loadDraft,
  saveDraft,
} from '@/services/draftStorage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(async () => {
  await AsyncStorage.clear();
});

const draft: Draft<{ answers: number[] }> = {
  userId: 'user1',
  module: 'personality',
  schemaVersion: 1,
  updatedAt: 1700000000000,
  data: { answers: [1, 2, 3] },
};

const KEY = 'matcha:draft:personality:user1';

describe('saveDraft', () => {
  it('stocke le draft avec la bonne clé', async () => {
    await saveDraft(draft);
    const raw = await AsyncStorage.getItem(KEY);
    expect(raw).toBe(JSON.stringify(draft));
  });
});

describe('loadDraft', () => {
  it('retourne le draft parsé', async () => {
    await saveDraft(draft);
    const loaded = await loadDraft<{ answers: number[] }>(
      'personality',
      'user1',
    );
    expect(loaded).toEqual(draft);
  });

  it('retourne null si aucun draft trouvé', async () => {
    const loaded = await loadDraft('personality', 'user-inconnu');
    expect(loaded).toBeNull();
  });

  it('retourne null et supprime la clé si le JSON est corrompu', async () => {
    await AsyncStorage.setItem(KEY, 'json invalide{{{');
    const loaded = await loadDraft('personality', 'user1');
    expect(loaded).toBeNull();
    const remaining = await AsyncStorage.getItem(KEY);
    expect(remaining).toBeNull();
  });
});

describe('clearDraft', () => {
  it('supprime le draft', async () => {
    await saveDraft(draft);
    await clearDraft('personality', 'user1');
    const remaining = await AsyncStorage.getItem(KEY);
    expect(remaining).toBeNull();
  });
});
