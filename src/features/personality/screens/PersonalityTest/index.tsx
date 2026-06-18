import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import { trackAnalyticsEvent } from '@/features/analytics';
import {
  PersonalityAnswer,
  PersonalityTemplate,
  getActivePersonalityTest,
  submitPersonalityTest,
} from '@/features/personality/api/personalityApi';
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

type PersonalityDraftData = {
  answers: [string, number][];
};

export default function PersonalityTestScreen() {
  const navigation = useNavigation<Nav>();

  const { user, refreshUser, logout } = useAuth();
  const userId = user?.id;

  const [test, setTest] = useState<PersonalityTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());

  const scrollViewRef = useRef<ScrollView>(null);
  const questionPositions = useRef<Map<string, number>>(new Map());
  const startedAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const answersRef = useRef(answers);
  const testRef = useRef<PersonalityTemplate | null>(null);

  // évite de restaurer plusieurs fois
  const restoredOnceRef = useRef(false);

  const serializeAnswers = (m: Map<string, number>) => Array.from(m.entries());
  const deserializeAnswers = (arr: [string, number][]) => new Map(arr);

  useEffect(() => {
    loadTest();
  }, []);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    testRef.current = test;
  }, [test]);

  useEffect(() => {
    return () => {
      const currentTest = testRef.current;
      if (
        !currentTest ||
        completedRef.current ||
        answersRef.current.size === 0
      ) {
        return;
      }

      trackAnalyticsEvent({
        eventType: 'test_abandoned',
        entityType: 'personality',
        entityId: `personality-${currentTest.version}`,
        stepId: `question-${answersRef.current.size}`,
        metadata: {
          answeredCount: answersRef.current.size,
          totalQuestions: currentTest.questions.length,
          durationMs: startedAtRef.current
            ? Date.now() - startedAtRef.current
            : undefined,
        },
      });
    };
  }, []);

  // Restore draft quand userId + test sont dispos
  useEffect(() => {
    const restoreDraft = async () => {
      if (!userId || !test) return;
      if (restoredOnceRef.current) return;

      restoredOnceRef.current = true;

      const draft = await loadDraft<PersonalityDraftData>(
        'personality',
        userId,
      );
      if (!draft) return;

      if (
        draft.templateId === test._id &&
        draft.templateVersion === test.version
      ) {
        setAnswers(deserializeAnswers(draft.data.answers));
      } else {
        await clearDraft('personality', userId);
      }
    };

    restoreDraft().catch(() => {});
  }, [userId, test]);

  const loadTest = async () => {
    try {
      const response = await getActivePersonalityTest();

      if (response.completed) {
        await refreshUser();
        return;
      }

      if (response.test) {
        setTest(response.test);
        startedAtRef.current = Date.now();
        trackAnalyticsEvent({
          eventType: 'test_started',
          entityType: 'personality',
          entityId: `personality-${response.test.version}`,
          metadata: {
            testName: response.test.title,
            version: response.test.version,
            totalQuestions: response.test.questions.length,
          },
        });
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        getApiErrorMessage(error, 'Impossible de charger le test'),
      );
    } finally {
      setLoading(false);
    }
  };

  const persistDraft = (newAnswers: Map<string, number>) => {
    if (!test || !userId) return;

    saveDraft<PersonalityDraftData>({
      userId,
      module: 'personality',
      schemaVersion: 1,
      templateId: test._id,
      templateVersion: test.version,
      updatedAt: Date.now(),
      data: { answers: serializeAnswers(newAnswers) },
    }).catch(() => {});
  };

  const handleRestart = () => {
    if (!userId) return;

    Alert.alert(
      'Repartir de zéro ?',
      'Tu vas supprimer ton brouillon et recommencer le test.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await clearDraft('personality', userId);
            setAnswers(new Map());

            // on évite que le useEffect re-restaure instant
            restoredOnceRef.current = true;

            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          },
        },
      ],
    );
  };

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, value);
    setAnswers(newAnswers);

    // persist draft
    persistDraft(newAnswers);

    if (!test) return;

    const index = test.questions.findIndex((q) => q.id === questionId);
    trackAnalyticsEvent({
      eventType: 'test_step_completed',
      entityType: 'personality',
      entityId: `personality-${test.version}`,
      stepId: questionId,
      metadata: {
        stepIndex: index + 1,
        totalSteps: test.questions.length,
      },
    });

    if (index < test.questions.length - 1) {
      const next = test.questions[index + 1];
      setTimeout(() => {
        const nextY = questionPositions.current.get(next.id);
        if (typeof nextY === 'number') {
          scrollViewRef.current?.scrollTo({
            y: Math.max(nextY - 20, 0),
            animated: true,
          });
        }
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (!test) return;

    if (answers.size !== test.questions.length) {
      Alert.alert('Test incomplet', 'Veuillez répondre à toutes les questions');
      return;
    }

    setSubmitting(true);

    try {
      const formattedAnswers: PersonalityAnswer[] = Array.from(
        answers.entries(),
      ).map(([id, value]) => ({ questionId: id, value }));

      const testResult = await submitPersonalityTest(formattedAnswers);
      completedRef.current = true;
      trackAnalyticsEvent({
        eventType: 'test_completed',
        entityType: 'personality',
        entityId: `personality-${test.version}`,
        metadata: {
          durationMs: startedAtRef.current
            ? Date.now() - startedAtRef.current
            : undefined,
          profileKey: testResult.type,
          profileLabel: testResult.label,
        },
      });

      // clear draft si submit OK
      if (userId) await clearDraft('personality', userId);

      navigation.navigate('PersonalityResult', { result: testResult });
    } catch (error) {
      Alert.alert(
        'Erreur',
        getApiErrorMessage(error, 'Impossible de soumettre le test'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!test) {
    return (
      <BackgroundRadial>
        <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
          <View style={styles.centerContainer}>
            <Text style={styles.errorTitle}>Aucun test disponible</Text>
            <Text style={styles.errorMessage}>
              Le test de personnalité n'a pas pu être chargé.{'\n'}
              Vérifiez que le backend est démarré et que le test a été seedé.
            </Text>

            <TouchableOpacity style={styles.retryButton} onPress={loadTest}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

  const isComplete = answers.size === test.questions.length;

  return (
    <BackgroundRadial>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <View style={styles.container}>
          <TestHeader
            title="Test de personnalité"
            summary="Réponds spontanément, sans trop réfléchir."
            currentQuestion={answers.size}
            totalQuestions={test.questions.length}
          />

          {/* action "reset draft" */}
          {answers.size > 0 && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={handleRestart}
                style={styles.restartButton}
              >
                <Text style={styles.restartText}>Repartir de zéro</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {test.questions.map((q, index) => (
              <View
                key={q.id}
                onLayout={(event) => {
                  questionPositions.current.set(
                    q.id,
                    event.nativeEvent.layout.y,
                  );
                }}
              >
                <QuestionCard
                  questionNumber={index + 1}
                  questionText={q.text}
                  options={q.options}
                  selectedValue={answers.get(q.id)}
                  onAnswer={(value) => handleAnswer(q.id, value)}
                />
              </View>
            ))}

            <View style={styles.scrollSpacer} />
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerMeta}>
              {isComplete
                ? 'Parfait, tu peux finaliser.'
                : `${test.questions.length - answers.size} question(s) restante(s)`}
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
                    ? 'Terminer le test'
                    : 'Complète toutes les questions'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, zIndex: 2 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 24 },
  scrollSpacer: { height: 8 },

  actionsRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'flex-end',
  },
  restartButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.72)',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  restartText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: '#232323',
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
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE7DF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  footerMeta: {
    fontSize: 12,
    fontFamily: titleFontFamily,
    color: '#2A2725',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorTitle: {
    color: 'red',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 15,
    fontFamily: bodyFontFamily,
    textAlign: 'center',
    marginBottom: 22,
    color: '#3D3834',
    lineHeight: 22,
  },
  retryButton: {
    ...primaryButton,
    minHeight: 48,
    paddingHorizontal: 28,
    marginBottom: 12,
  },
  retryButtonText: {
    ...primaryButtonText,
    fontWeight: '600',
    fontFamily: titleFontFamily,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  logoutButtonText: {
    color: '#232323',
    fontWeight: '600',
    fontFamily: titleFontFamily,
  },
});
