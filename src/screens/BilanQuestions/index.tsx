import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BilanAnswersPayload,
  BilanQuestion,
  generateBilan,
  getBilanQuestions,
  postBilanAnswers,
} from '@/api/bilan';
import BackgroundRadial from '@/components/Background/BackgroundRadial';
import QuestionCard from '@/components/Personality/QuestionCard';
import TestHeader from '@/components/Personality/TestHeader';
import Colors from '@/themes/colors';
import { HomeStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export default function BilanQuestionsScreen() {
  const navigation = useNavigation<Nav>();

  const scrollRef = useRef<ScrollView>(null);
  const questionRefs = useRef<Map<string, View>>(new Map());

  const [questions, setQuestions] = useState<BilanQuestion[]>([]);
  const [version, setVersion] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // réponses stockées comme pour le test perso
  const [answers, setAnswers] = useState<Record<string, number | string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBilanQuestions();
        setQuestions(res.questions);
        setVersion(res.version);
      } catch (e) {
        console.error('Erreur chargement bilan :', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLikertAnswer = (code: string, value: number, index: number) => {
    setAnswers((prev) => ({ ...prev, [code]: value }));
    scrollToNext(index);
  };

  const handleTextAnswer = (code: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [code]: text }));
  };

  const scrollToNext = (currentIndex: number) => {
    if (currentIndex >= questions.length - 1) return;

    const nextQuestion = questions[currentIndex + 1];
    const ref = questionRefs.current.get(nextQuestion.code);

    if (!ref) return;

    setTimeout(() => {
      ref.measureLayout(
        scrollRef.current as any,
        (_, y) => scrollRef.current?.scrollTo({ y: y - 20, animated: true }),
        () => {},
      );
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
      navigation.navigate('BilanResult', { bilan: generated.bilan });
    } catch (e) {
      console.error('Erreur soumission bilan :', e);
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
    <BackgroundRadial>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TestHeader
            title="Bilan de compétences"
            summary="Réponds aux questions pour générer ton analyse."
            currentQuestion={answeredCount}
            totalQuestions={totalQuestions}
          />

          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {questions.map((q, index) => (
              <View
                key={q.code}
                ref={(ref) => {
                  if (ref) {
                    questionRefs.current.set(q.code, ref);
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
                {q.type === 'open_text' && (
                  <View style={styles.textCard}>
                    <Text style={styles.badge}>Question {index + 1}</Text>
                    <Text style={styles.textQuestion}>{q.question}</Text>

                    <TextInput
                      style={styles.input}
                      multiline
                      placeholder="Écris ta réponse..."
                      value={
                        typeof answers[q.code] === 'string'
                          ? (answers[q.code] as string)
                          : ''
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
                )}
              </View>
            ))}

            {/* -------------------- SUBMIT ---------------------- */}
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
                    ? 'Terminer le bilan'
                    : 'Complète toutes les questions'}
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
  bubblesLayer: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  container: { flex: 1, zIndex: 2 },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 60 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  textCard: {
    backgroundColor: '#ffffffdd',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.greenDark.normal,
    marginBottom: 8,
  },
  textQuestion: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.greyDark.normal,
    marginBottom: 12,
  },
  input: {
    minHeight: 120,
    backgroundColor: '#eef1ee',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },

  nextBtn: {
    backgroundColor: Colors.greenDark.normal,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },

  submitButton: {
    backgroundColor: '#0A2916',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
