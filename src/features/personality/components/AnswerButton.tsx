import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Colors from '@/themes/colors';

interface AnswerButtonProps {
  value: number;
  index: number;
  totalOptions: number;
  isSelected: boolean;
  onPress: () => void;
}

export default function AnswerButton({
  value,
  index,
  totalOptions,
  isSelected,
  onPress,
}: AnswerButtonProps) {
  const middleIndex = (totalOptions - 1) / 2;
  const distanceFromMiddle = Math.abs(index - middleIndex);

  const sizeScale = 0.86 + (distanceFromMiddle / middleIndex) * 0.24;
  const circleSize = 32 * sizeScale;

  let circleColor = '#F1EFEA';
  let borderColor = 'rgba(31,31,31,0.035)';
  let shadowOpacity = 0.03;

  if (isSelected) {
    if (index < 2) {
      circleColor = '#CFEBDD';
      borderColor = '#A8D8C5';
    } else if (index === 2) {
      circleColor = '#99D3BA';
      borderColor = '#6DB89F';
    } else {
      circleColor = Colors.accent.primary;
      borderColor = Colors.accent.primary;
    }
    shadowOpacity = 0.12;
  }

  const dynamicCircleStyle = {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: circleColor,
    borderColor,
    shadowOpacity,
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Réponse ${value}`}
    >
      <View style={[styles.circle, dynamicCircleStyle]}>
        {isSelected ? <View style={styles.innerDot} /> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#6A5D4E',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
  },
  innerDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
