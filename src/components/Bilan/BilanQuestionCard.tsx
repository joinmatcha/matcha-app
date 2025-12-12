import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { BilanQuestion } from '@/api/bilan';
import Colors from '@/themes/colors';

type Props = {
  question: BilanQuestion;
  value?: number | string;
  onAnswer: (value: number | string) => void;
  questionNumber?: number;
  totalQuestions?: number;
};

export default function BilanQuestionCard({
  question,
  value,
  onAnswer,
  questionNumber,
  totalQuestions,
}: Props) {
  const isLikert = question.type === 'likert_1_5';
  const isOpenText = question.type === 'open_text';

  return (
    <View style={styles.card}>
      {typeof questionNumber === 'number' &&
        typeof totalQuestions === 'number' && (
          <Text style={styles.questionCounter}>
            Question {questionNumber}/{totalQuestions}
          </Text>
        )}

      <Text style={styles.questionText}>{question.question}</Text>

      {isLikert && (
        <View style={styles.likertRow}>
          {[1, 2, 3, 4, 5].map((note) => {
            const active = value === note;
            return (
              <TouchableOpacity
                key={note}
                style={[
                  styles.likertButton,
                  active && styles.likertButtonActive,
                ]}
                onPress={() => onAnswer(note)}
              >
                <Text
                  style={[
                    styles.likertLabel,
                    active && styles.likertLabelActive,
                  ]}
                >
                  {note}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {isOpenText && (
        <TextInput
          multiline
          style={styles.textArea}
          placeholder="Écris librement ta réponse ici..."
          placeholderTextColor="rgba(0,0,0,0.35)"
          value={typeof value === 'string' ? value : ''}
          onChangeText={onAnswer}
        />
      )}

      <View style={styles.helperRow}>
        <Text style={styles.domainBadge}>
          {question.domain} · {question.subdomain}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  questionCounter: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.45)',
    marginBottom: 4,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.greyDark.normal,
    fontWeight: '600',
    marginBottom: 12,
  },
  likertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  likertButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  likertButtonActive: {
    backgroundColor: Colors.greenLight.normal,
    borderColor: Colors.greenDark.normal,
  },
  likertLabel: {
    fontSize: 15,
    color: Colors.greyDark.normal,
    fontWeight: '500',
  },
  likertLabelActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  textArea: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 15,
    color: Colors.greyDark.normal,
    backgroundColor: '#fff',
  },
  helperRow: {
    marginTop: 10,
  },
  domainBadge: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)',
  },
});
