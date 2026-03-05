import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '@/themes/colors';
import { titleFontFamily } from '@/themes/typography';
import { cardSurface } from '@/themes/ui';

export default function EditableSection({
  title,
  isEditing,
  onEdit,
  children,
}: {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        {!isEditing && (
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editButton}>Modifier</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardSurface,
    borderRadius: 24,
    padding: 22,
    marginBottom: 22,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: '#1F1F1F',
  },

  editButton: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
    backgroundColor: Colors.accent.soft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  content: {
    marginTop: 4,
    gap: 12,
  },
});
