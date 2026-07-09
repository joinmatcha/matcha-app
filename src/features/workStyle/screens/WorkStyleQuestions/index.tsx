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

import AppScreen from '@/components/layout/AppScreen';
import { trackAnalyticsEvent } from '@/features/analytics';
import QuestionCard from '@/features/personality/components/QuestionCard';
import TestHeader from '@/features/personality/components/TestHeader';
import {
  WorkStyleAnswer,
  WorkStyleTemplate,
  getActiveWorkStyleTest,
  submitWorkStyleTest,
} from '@/features/workStyle/api/workStyleApi';
import Colors from '@/themes/colors';
import { bodyFontFamily } from '@/themes/typography';
import { primaryButton, primaryButtonText } from '@/themes/ui';
import { RootStackParamList } from '@/types/navigation';
import { getApiErrorMessage } from '@/utils/apiError';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const options = [
  { value: 1, label: 'Pas du tout' },
  { value: 2, label: 'Plutôt non' },
  { value: 3, label: 'Neutre' },
  { value: 4, label: 'Plutôt oui' },
  { value: 5, label: 'Tout à fait' },
];

export default function WorkStyleQuestionsScreen() {
  const navigation = useNavigation<Nav>();
  const [test, setTest] = useState<WorkStyleTemplate | null>(null);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const questionPositions = useRef<Map<string, number>>(new Map());
  const startedAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const answersRef = useRef(answers);
  const testRef = useRef<WorkStyleTemplate | null>(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    testRef.current = test;
  }, [test]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const response = await getActiveWorkStyleTest();
        if (mounted) {
          setTest(response.test);
          startedAtRef.current = Date.now();
          trackAnalyticsEvent({
            eventType: 'test_started',
            entityType: 'work_style',
            entityId: `work-style-v${response.test.version}`,
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
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

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
        entityType: 'work_style',
        entityId: `work-style-v${currentTest.version}`,
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

  const handleAnswer = (questionId: string, value: number) => {
    const nextAnswers = new Map(answers);
    nextAnswers.set(questionId, value);
    setAnswers(nextAnswers);

    if (!test) return;
    const index = test.questions.findIndex(
      (question) => question.id === questionId,
    );
    trackAnalyticsEvent({
      eventType: 'test_step_completed',
      entityType: 'work_style',
      entityId: `work-style-v${test.version}`,
      stepId: questionId,
      metadata: {
        stepIndex: index + 1,
        totalSteps: test.questions.length,
      },
    });

    const nextQuestion = test.questions[index + 1];
    if (nextQuestion) {
      setTimeout(() => {
        const nextY = questionPositions.current.get(nextQuestion.id);
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
      Alert.alert('Test incomplet', 'Réponds à toutes les questions.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: WorkStyleAnswer[] = Array.from(answers.entries()).map(
        ([questionId, value]) => ({ questionId, value }),
      );
      const result = await submitWorkStyleTest(payload);
      completedRef.current = true;
      trackAnalyticsEvent({
        eventType: 'test_completed',
        entityType: 'work_style',
        entityId: `work-style-v${result.version}`,
        metadata: {
          durationMs: startedAtRef.current
            ? Date.now() - startedAtRef.current
            : undefined,
          profileKey: result.profile.key,
          profileTitle: result.profile.title,
          topAxes: result.topAxes,
        },
      });
      navigation.replace('WorkStyleResult', { result });
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
      <AppScreen>
        <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Aucun test disponible.</Text>
          </View>
        </SafeAreaView>
      </AppScreen>
    );
  }

  const isComplete = answers.size === test.questions.length;

  return (
    <AppScreen>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <View style={styles.container}>
          <TestHeader
            title="Style professionnel"
            summary="Réponds selon ton fonctionnement naturel au travail."
            currentQuestion={answers.size}
            totalQuestions={test.questions.length}
          />

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.questionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {test.questions.map((question, index) => (
              <View
                key={question.id}
                onLayout={(event) => {
                  questionPositions.current.set(
                    question.id,
                    event.nativeEvent.layout.y,
                  );
                }}
              >
                <QuestionCard
                  questionNumber={index + 1}
                  questionText={question.text}
                  options={options}
                  selectedValue={answers.get(question.id)}
                  onAnswer={(value) => handleAnswer(question.id, value)}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles.submitButton,
                !isComplete && styles.disabledButton,
              ]}
              disabled={!isComplete || submitting}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Analyse...' : 'Voir mon résultat'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: bodyFontFamily,
    color: Colors.text.strong,
    textAlign: 'center',
  },
  questionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
  submitButton: {
    ...primaryButton,
    marginTop: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    ...primaryButtonText,
  },
});
