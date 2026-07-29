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
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(15,20,28,0.06)',
    shadowColor: '#5C5148',
    shadowOpacity: 0.055,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Colors.accent.soft,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsWrapper: {
    gap: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 8,
  },
  labelText: {
    fontSize: 10,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
    maxWidth: '45%',
    fontWeight: '600',
  },
});
