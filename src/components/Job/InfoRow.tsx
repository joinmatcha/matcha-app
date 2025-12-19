import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function InfoRow({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6BBF8E',
    marginTop: 7,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0,0,0,0.75)',
    flex: 1,
  },
});
