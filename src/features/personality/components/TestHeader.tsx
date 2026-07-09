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
    paddingHorizontal: 24,
    paddingTop: 18,
    marginBottom: 16,
  },
  headerCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.08)',
    padding: 18,
    shadowColor: '#5C5148',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 4,
  },
  summary: {
    fontSize: 13,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
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
    backgroundColor: Colors.accent.soft,
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
    backgroundColor: Colors.accent.soft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
