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
import Toast from 'react-native-toast-message';

import {
  PersonalityAnswer,
  PersonalityTemplate,
  getActivePersonalityTest,
  submitPersonalityTest,
} from '@/api/personality';
import BackgroundRadial from '@/components/Background/BackgroundRadial';
import { QuestionCard, TestHeader } from '@/components/Personality';
import { useAuth } from '@/hooks/useAuth';
import { clearDraft, loadDraft, saveDraft } from '@/services/draftStorage';
import Colors from '@/themes/colors';
import { HomeStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

type PersonalityDraftData = {
  answers: [string, number][];
};

export default function PersonalityTestScreen() {
  const navigation = useNavigation<Nav>();

  const { user, refreshUser, logout } = useAuth();
  const userId = (user as any)?.id ?? (user as any)?._id;

  const [test, setTest] = useState<PersonalityTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());

  const scrollViewRef = useRef<ScrollView>(null);
  const questionRefs = useRef<Map<string, View>>(new Map());

  // évite de restaurer plusieurs fois
  const restoredOnceRef = useRef(false);

  const serializeAnswers = (m: Map<string, number>) => Array.from(m.entries());
  const deserializeAnswers = (arr: [string, number][]) => new Map(arr);

  useEffect(() => {
    loadTest();
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
        Toast.show({
          type: 'info',
          text1: 'Brouillon restauré',
          text2: 'Tu peux reprendre le test où tu t’étais arrêté.',
        });
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
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error.response?.data?.message || 'Impossible de charger le test',
      });
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

            Toast.show({
              type: 'success',
              text1: 'Brouillon supprimé',
              text2: 'Tu peux recommencer le test.',
            });

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
    if (index < test.questions.length - 1) {
      const next = test.questions[index + 1];
      setTimeout(() => {
        const ref = questionRefs.current.get(next.id);
        if (ref) {
          ref.measureLayout(
            scrollViewRef.current as any,
            (_, y) =>
              scrollViewRef.current?.scrollTo({ y: y - 20, animated: true }),
            () => {},
          );
        }
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (!test) return;

    if (answers.size !== test.questions.length) {
      return Toast.show({
        type: 'error',
        text1: 'Test incomplet',
        text2: 'Veuillez répondre à toutes les questions',
      });
    }

    setSubmitting(true);

    try {
      const formattedAnswers: PersonalityAnswer[] = Array.from(
        answers.entries(),
      ).map(([id, value]) => ({ questionId: id, value }));

      const testResult = await submitPersonalityTest(formattedAnswers);

      // clear draft si submit OK
      if (userId) await clearDraft('personality', userId);

      navigation.navigate('PersonalityResult', { result: testResult });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2:
          error.response?.data?.message || 'Impossible de soumettre le test',
      });
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
        <SafeAreaView style={styles.safeArea}>
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TestHeader
            title={test.title}
            summary={test.summary}
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
                ref={(ref) => {
                  if (ref) questionRefs.current.set(q.id, ref);
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

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isComplete || submitting) && styles.submitButtonDisabled,
              ]}
              disabled={!isComplete || submitting}
              onPress={handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isComplete
                    ? 'Terminer le test'
                    : 'Complétez toutes les questions'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
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
  scrollContent: { padding: 20, paddingBottom: 40 },

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
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  restartText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.55)',
  },

  submitButton: {
    backgroundColor: '#0A2916',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  errorTitle: {
    color: 'red',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 22,
    color: '#333',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#0A2916',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginBottom: 12,
  },
  retryButtonText: { color: 'white', fontWeight: '600' },
  logoutButton: {
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderColor: '#0A2916',
  },
  logoutButtonText: { color: '#0A2916', fontWeight: '600' },
});
