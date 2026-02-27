export { default as BilanIntroScreen } from './screens/BilanIntro';
export { default as BilanQuestionsScreen } from './screens/BilanQuestions';
export { default as BilanResultScreen } from './screens/BilanResult';

export {
  getBilanQuestions,
  postBilanAnswers,
  generateBilan,
  getMyBilan,
} from './api/bilanApi';
export type {
  BilanQuestion,
  BilanAnswersPayload,
  BilanResult,
} from './api/bilanApi';

export { useBilan } from './hooks/useBilan';
