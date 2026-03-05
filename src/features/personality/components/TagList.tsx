import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/themes/colors';
import { bodyFontFamily } from '@/themes/typography';

interface TagListProps {
  items: string[];
  variant?: 'success' | 'warning';
}

export default function TagList({ items, variant = 'success' }: TagListProps) {
  return (
    <View style={styles.tagContainer}>
      {items.map((item, index) => (
        <View
          key={index}
          style={[styles.tag, variant === 'warning' && styles.tagWarning]}
        >
          <Text
            style={[
              styles.tagText,
              variant === 'warning' && styles.tagTextWarning,
            ]}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: Colors.accent.soft,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  tagWarning: {
    backgroundColor: '#F3EFED',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: bodyFontFamily,
    color: Colors.accent.strong,
  },
  tagTextWarning: {
    color: '#6A5A51',
  },
});
