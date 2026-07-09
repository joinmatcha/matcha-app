import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function SurfaceCard({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.08)',
    shadowColor: '#5C5148',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
});
