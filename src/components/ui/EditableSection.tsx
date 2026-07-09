import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/themes/colors';
import { titleFontFamily } from '@/themes/typography';
import { cardSurface } from '@/themes/ui';

import MatchaButton from './MatchaButton';

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
          <MatchaButton label="Modifier" icon="edit" onPress={onEdit} />
        )}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardSurface,
    borderRadius: 8,
    padding: 18,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },

  title: {
    flex: 1,
    fontSize: 20,
    lineHeight: 25,
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },

  content: {
    marginTop: 4,
    gap: 12,
  },
});
