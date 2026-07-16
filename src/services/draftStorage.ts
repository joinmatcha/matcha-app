import AsyncStorage from '@react-native-async-storage/async-storage';

type Module = 'personality' | 'bilan' | 'work_style';

export type Draft<T> = {
  userId: string;
  module: Module;
  schemaVersion: 1;
  templateId?: string;
  templateVersion?: string;
  updatedAt: number;
  data: T;
};

const keyFor = (module: Module, userId: string) =>
  `matcha:draft:${module}:${userId}`;

export async function saveDraft<T>(draft: Draft<T>) {
  await AsyncStorage.setItem(
    keyFor(draft.module, draft.userId),
    JSON.stringify(draft),
  );
}

export async function loadDraft<T>(
  module: Module,
  userId: string,
): Promise<Draft<T> | null> {
  const raw = await AsyncStorage.getItem(keyFor(module, userId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Draft<T>;
  } catch {
    await AsyncStorage.removeItem(keyFor(module, userId));
    return null;
  }
}

export async function clearDraft(module: Module, userId: string) {
  await AsyncStorage.removeItem(keyFor(module, userId));
}
