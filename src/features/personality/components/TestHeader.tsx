import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';

interface TestHeaderProps {
  title: string;
  summary?: string;
  currentQuestion: number;
  totalQuestions: number;
}

export default function TestHeader({
  title,
  summary,
  currentQuestion,
  totalQuestions,
}: TestHeaderProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerCard}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.progressText}>
            {currentQuestion} / {totalQuestions}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        {summary && <Text style={styles.summary}>{summary}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 12,
  },
  headerCard: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(15,20,28,0.06)',
    shadowColor: '#5C5148',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  summary: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    marginTop: 9,
    height: 5,
    backgroundColor: 'rgba(42,127,104,0.13)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent.primary,
    borderRadius: 999,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
    minWidth: 58,
    textAlign: 'center',
    backgroundColor: Colors.accent.soft,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
});
