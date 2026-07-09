import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';

import AnswerButton from './AnswerButton';

interface QuestionOption {
  value: number;
  label: string;
}

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  options: QuestionOption[];
  selectedValue?: number;
  onAnswer: (value: number) => void;
}

export default function QuestionCard({
  questionNumber,
  questionText,
  options,
  selectedValue,
  onAnswer,
}: QuestionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Question {questionNumber}</Text>
      </View>

      <Text style={styles.questionText}>{questionText}</Text>

      <View style={styles.optionsWrapper}>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <AnswerButton
              key={option.value}
              value={option.value}
              index={index}
              totalOptions={options.length}
              isSelected={selectedValue === option.value}
              onPress={() => onAnswer(option.value)}
            />
          ))}
        </View>
        <View style={styles.labelsContainer}>
          <Text style={styles.labelText}>Pas du tout d'accord</Text>
          <Text style={styles.labelText}>Tout à fait d'accord</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.08)',
    shadowColor: '#5C5148',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.accent.soft,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 18,
    lineHeight: 25,
  },
  optionsWrapper: {
    gap: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 10,
  },
  labelText: {
    fontSize: 11,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
    maxWidth: '45%',
    fontWeight: '600',
  },
});
