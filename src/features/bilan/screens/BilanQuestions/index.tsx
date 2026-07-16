import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppScreen from '@/components/layout/AppScreen';
import { trackAnalyticsEvent } from '@/features/analytics';
import {
  BilanAnswersPayload,
  BilanQuestion,
  generateBilan,
  getBilanQuestions,
  postBilanAnswers,
} from '@/features/bilan/api/bilanApi';
import QuestionCard from '@/features/personality/components/QuestionCard';
import TestHeader from '@/features/personality/components/TestHeader';
import { useAuth } from '@/hooks/useAuth';
import { clearDraft, loadDraft, saveDraft } from '@/services/draftStorage';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import { primaryButton, primaryButtonText } from '@/themes/ui';
import { RootStackParamList } from '@/types/navigation';
import { getApiErrorMessage } from '@/utils/apiError';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type BilanDraftData = {
  answers: [string, number | string][];
};

export default function BilanQuestionsScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const userId = user?.id;

  const scrollRef = useRef<ScrollView>(null);
  const questionPositions = useRef<Map<string, number>>(new Map());
  const restoredOnceRef = useRef(false);
  const pendingRestoreScrollRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const [questions, setQuestions] = useState<BilanQuestion[]>([]);
  const [version, setVersion] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // réponses stockées comme pour le test perso
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const answersRef = useRef<Record<string, number | string>>({});
  const questionsRef = useRef<BilanQuestion[]>([]);
  const versionRef = useRef(1);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    versionRef.current = version;
  }, [version]);

  const scrollToQuestion = (questionCode: string, animated = false) => {
    const y = questionPositions.current.get(questionCode);
    if (typeof y !== 'number') return false;

    scrollRef.current?.scrollTo({
      y: Math.max(y - 20, 0),
      animated,
    });
    return true;
  };

  const getFirstUnansweredQuestionCode = (
    currentQuestions: BilanQuestion[],
    currentAnswers: Record<string, number | string>,
  ) =>
    currentQuestions.find((question) => {
      const answer = currentAnswers[question.code];
      if (typeof answer === 'string') return answer.trim().length === 0;
      return answer === undefined;
    })?.code ?? currentQuestions[currentQuestions.length - 1]?.code;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBilanQuestions();
        setQuestions(res.questions);
        setVersion(res.version);
        startedAtRef.current = Date.now();
        trackAnalyticsEvent({
          eventType: 'test_started',
          entityType: 'bilan',
          entityId: `bilan-v${res.version}`,
          metadata: {
            testName: 'Auto-évaluation professionnelle',
            version: res.version,
            totalQuestions: res.questions.length,
          },
        });

        if (userId && !restoredOnceRef.current) {
          restoredOnceRef.current = true;
          const draft = await loadDraft<BilanDraftData>('bilan', userId);

          if (draft && draft.templateVersion === String(res.version)) {
            const restoredAnswers = Object.fromEntries(draft.data.answers);
            const firstUnansweredCode = getFirstUnansweredQuestionCode(
              res.questions,
              restoredAnswers,
            );
            setAnswers(restoredAnswers);
            pendingRestoreScrollRef.current = firstUnansweredCode ?? null;
            setTimeout(() => {
              if (
                pendingRestoreScrollRef.current &&
                scrollToQuestion(pendingRestoreScrollRef.current)
              ) {
                pendingRestoreScrollRef.current = null;
              }
            }, 350);
          } else if (draft) {
            await clearDraft('bilan', userId);
          }
        }

        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Impossible de charger les questions de l'auto-évaluation.",
          ),
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  useEffect(() => {
    return () => {
      const answeredCount = Object.keys(answersRef.current).length;
      if (
        !questionsRef.current.length ||
        completedRef.current ||
        answeredCount === 0
      ) {
        return;
      }

      trackAnalyticsEvent({
        eventType: 'test_abandoned',
        entityType: 'bilan',
        entityId: `bilan-v${versionRef.current}`,
        stepId: `question-${answeredCount}`,
        metadata: {
          answeredCount,
          totalQuestions: questionsRef.current.length,
          durationMs: startedAtRef.current
            ? Date.now() - startedAtRef.current
            : undefined,
        },
      });
    };
  }, []);

  const persistDraft = (nextAnswers: Record<string, number | string>) => {
    if (!userId || !version) return;

    saveDraft<BilanDraftData>({
      userId,
      module: 'bilan',
      schemaVersion: 1,
      templateVersion: String(version),
      updatedAt: Date.now(),
      data: {
        answers: Object.entries(nextAnswers),
      },
    }).catch(() => {});
  };

  const handleRestart = () => {
    if (!userId) return;

    Alert.alert(
      'Repartir de zéro ?',
      "Tu vas supprimer ton brouillon et recommencer l'auto-évaluation.",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await clearDraft('bilan', userId);
            setAnswers({});
            restoredOnceRef.current = true;
            scrollRef.current?.scrollTo({ y: 0, animated: true });
          },
        },
      ],
    );
  };

  const handleLikertAnswer = (code: string, value: number, index: number) => {
    setAnswers((prev) => {
      const nextAnswers = { ...prev, [code]: value };
      persistDraft(nextAnswers);
      return nextAnswers;
    });
    trackAnalyticsEvent({
      eventType: 'test_step_completed',
      entityType: 'bilan',
      entityId: `bilan-v${version}`,
      stepId: code,
      metadata: {
        stepIndex: index + 1,
        totalSteps: questions.length,
      },
    });
    scrollToNext(index);
  };

  const handleTextAnswer = (code: string, text: string) => {
    setAnswers((prev) => {
      const nextAnswers = { ...prev, [code]: text };
      persistDraft(nextAnswers);
      return nextAnswers;
    });
  };

  const scrollToNext = (currentIndex: number) => {
    if (currentIndex >= questions.length - 1) return;

    const nextQuestion = questions[currentIndex + 1];
    const nextY = questionPositions.current.get(nextQuestion.code);
    if (typeof nextY !== 'number') return;

    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(nextY - 20, 0),
        animated: true,
      });
    }, 120);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const payload: BilanAnswersPayload[] = Object.entries(answers).map(
      ([code, value]) => ({
        questionCode: code,
        valueNumber: typeof value === 'number' ? value : undefined,
        valueText: typeof value === 'string' ? value : undefined,
      }),
    );

    try {
      await postBilanAnswers(version, payload);
      const generated = await generateBilan(version);
      completedRef.current = true;
      trackAnalyticsEvent({
        eventType: 'test_completed',
        entityType: 'bilan',
        entityId: `bilan-v${version}`,
        metadata: {
          durationMs: startedAtRef.current
            ? Date.now() - startedAtRef.current
            : undefined,
          archetypeId: generated.bilan.conclusion.archetype.id,
          archetypeTitle: generated.bilan.conclusion.archetype.title,
        },
      });
      generated.bilan.conclusion.recommendedJobs.forEach((job, index) => {
        trackAnalyticsEvent({
          eventType: 'job_matched',
          entityType: 'job',
          entityId: job.id,
          metadata: {
            jobTitle: job.title,
            domain: job.sector,
            rank: index + 1,
            score: job.score,
            sourceTest: 'bilan',
          },
        });
      });
      if (userId) await clearDraft('bilan', userId);
      setErrorMessage(null);
      navigation.replace('BilanResult', { bilan: generated.bilan });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Erreur lors de la soumission de l'auto-évaluation.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;

  return (
    <AppScreen>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <View style={styles.container}>
          <TestHeader
            title="Auto-évaluation professionnelle"
            summary="Réponds simplement. L'objectif est de faire ressortir ce qui te correspond aujourd'hui."
            currentQuestion={answeredCount}
            totalQuestions={totalQuestions}
          />

          {answeredCount > 0 && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={handleRestart}
                style={styles.restartButton}
              >
                <Text style={styles.restartButtonText}>Repartir de zéro</Text>
              </TouchableOpacity>
            </View>
          )}

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {questions.map((q, index) => (
              <View
                key={q.code}
                onLayout={(event) => {
                  questionPositions.current.set(
                    q.code,
                    event.nativeEvent.layout.y,
                  );
                  if (pendingRestoreScrollRef.current === q.code) {
                    setTimeout(() => {
                      if (scrollToQuestion(q.code)) {
                        pendingRestoreScrollRef.current = null;
                      }
                    }, 50);
                  }
                }}
              >
                {/* ----------------- LIKERT ----------------- */}
                {q.type === 'likert_1_5' && (
                  <QuestionCard
                    questionNumber={index + 1}
                    questionText={q.question}
                    options={[
                      { value: 1, label: '' },
                      { value: 2, label: '' },
                      { value: 3, label: '' },
                      { value: 4, label: '' },
                      { value: 5, label: '' },
                    ]}
                    selectedValue={
                      typeof answers[q.code] === 'number'
                        ? (answers[q.code] as number)
                        : undefined
                    }
                    onAnswer={(value) =>
                      handleLikertAnswer(q.code, value, index)
                    }
                  />
                )}

                {/* ---------------- OPEN TEXT --------------- */}
                {q.type === 'open_text' &&
                  (() => {
                    const answerValue = answers[q.code];
                    const hasTextAnswer =
                      typeof answerValue === 'string' &&
                      answerValue.trim().length > 0;

                    return (
                      <View style={styles.textCard}>
                        <Text style={styles.badge}>Question {index + 1}</Text>
                        <Text style={styles.textQuestion}>{q.question}</Text>
                        <Text style={styles.textHint}>
                          Quelques lignes suffisent. Va droit au plus utile.
                        </Text>

                        <TextInput
                          style={[
                            styles.input,
                            hasTextAnswer && styles.inputAnswered,
                          ]}
                          multiline
                          placeholder="Écris ta réponse..."
                          placeholderTextColor="rgba(87, 82, 77, 0.62)"
                          value={
                            typeof answerValue === 'string' ? answerValue : ''
                          }
                          onChangeText={(t) => handleTextAnswer(q.code, t)}
                        />

                        <TouchableOpacity
                          style={styles.nextBtn}
                          onPress={() => scrollToNext(index)}
                        >
                          <Text style={styles.nextBtnText}>Continuer</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })()}
              </View>
            ))}

            <View style={styles.scrollSpacer} />
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerMeta}>
              {isComplete
                ? 'Parfait, tu peux finaliser.'
                : `${totalQuestions - answeredCount} question(s) restante(s)`}
            </Text>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isComplete || submitting) && styles.submitButtonDisabled,
              ]}
              disabled={!isComplete || submitting}
              onPress={handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#4F4741" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isComplete
                    ? "Terminer l'auto-évaluation"
                    : 'Complète toutes les questions'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  bubblesLayer: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  container: { flex: 1, zIndex: 2 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  scrollSpacer: { height: 8 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actionsRow: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'flex-end',
  },
  restartButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.accent.border,
    shadowColor: '#5C5148',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  restartButtonText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  errorText: {
    marginHorizontal: 20,
    marginBottom: 8,
    color: Colors.error,
    fontWeight: '600',
    fontFamily: titleFontFamily,
  },

  textCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accent.border,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#5C5148',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  textQuestion: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 8,
    lineHeight: 24,
  },
  textHint: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
    marginBottom: 12,
  },
  input: {
    minHeight: 120,
    backgroundColor: Colors.accent.soft,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    fontFamily: bodyFontFamily,
    color: Colors.text.strong,
    lineHeight: 21,
    textAlignVertical: 'top',
  },
  inputAnswered: {
    backgroundColor: '#EEF6F1',
  },

  nextBtn: {
    ...primaryButton,
    minHeight: 46,
  },
  nextBtnText: {
    ...primaryButtonText,
    fontSize: 15,
    fontFamily: titleFontFamily,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.accent.border,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  footerMeta: {
    fontSize: 12,
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  submitButton: {
    ...primaryButton,
    backgroundColor: Colors.accent.primary,
    shadowColor: '#1B6F52',
    minHeight: 52,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: {
    ...primaryButtonText,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: titleFontFamily,
  },
});
