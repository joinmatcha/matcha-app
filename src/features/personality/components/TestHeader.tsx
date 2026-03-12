import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import { cardSurface } from '@/themes/ui';

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
        <Text style={styles.title}>{title}</Text>
        {summary && <Text style={styles.summary}>{summary}</Text>}

        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion} / {totalQuestions}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  headerCard: {
    ...cardSurface,
    padding: 18,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: '#1F1F1F',
    marginBottom: 4,
  },
  summary: {
    fontSize: 13,
    fontFamily: bodyFontFamily,
    color: '#2A2A2A',
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 7,
    backgroundColor: '#DFF0E8',
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
    minWidth: 56,
    textAlign: 'center',
    backgroundColor: '#EAF7F1',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
