export { default as SwipeScreen } from './screens/Swipe';

export { getDeck, postSwipe } from './api/swipeApi';
export type { DeckJob } from './api/swipeApi';

export { getPreferences } from './api/preferencesApi';
export type { Preferences } from './api/preferencesApi';

export { useSwipe } from './hooks/useSwipe';
