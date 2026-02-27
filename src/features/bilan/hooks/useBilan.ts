import { useCallback, useEffect, useState } from 'react';

import {
  BilanAnswersPayload,
  BilanQuestion,
  BilanResult,
  generateBilan,
  getBilanQuestions,
  getMyBilan,
  postBilanAnswers,
} from '@/features/bilan/api/bilanApi';
import { getApiErrorMessage } from '@/utils/apiError';

export function useBilan() {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<number | null>(null);
  const [questions, setQuestions] = useState<BilanQuestion[]>([]);
  const [bilan, setBilan] = useState<BilanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBilanQuestions();
      setQuestions(res.questions);
      setVersion(res.version);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossible de charger le bilan.'));
      setQuestions([]);
      setVersion(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBilan = useCallback(async () => {
    try {
      const res = await getMyBilan();
      setBilan(res.bilan ?? null);
    } catch {
      setBilan(null);
    }
  }, []);

  const saveAnswers = async (
    version: number,
    answers: BilanAnswersPayload[],
  ) => {
    return postBilanAnswers(version, answers);
  };

  const generate = async (version: number) => {
    const res = await generateBilan(version);
    setBilan(res.bilan);
    return res;
  };

  useEffect(() => {
    loadQuestions();
    loadBilan();
  }, [loadQuestions, loadBilan]);

  return {
    loading,
    error,
    version,
    questions,
    bilan,
    refreshQuestions: loadQuestions,
    refreshBilan: loadBilan,
    saveAnswers,
    generate,
  };
}
