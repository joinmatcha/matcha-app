import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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

  const sizeScale = 0.82 + (distanceFromMiddle / middleIndex) * 0.34;
  const circleSize = 34 * sizeScale;

  let circleColor = '#F5F3F0';
  let shadowOpacity = 0.05;

  if (isSelected) {
    if (index < 2) {
      circleColor = '#BFDCCF';
    } else if (index === 2) {
      circleColor = '#8DBBA6';
    } else {
      circleColor = '#2F7A5F';
    }
    shadowOpacity = 0.16;
  }

  const dynamicCircleStyle = {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: circleColor,
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
    shadowColor: '#6A5D4E',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  innerDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
