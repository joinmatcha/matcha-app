import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackHeaderLeftProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Colors from '@/themes/colors';

export default function StackBackButton({
  canGoBack,
  tintColor,
}: NativeStackHeaderLeftProps) {
  const navigation = useNavigation();

  if (!canGoBack) return null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Revenir en arrière"
      hitSlop={12}
      onPress={() => navigation.goBack()}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <MaterialIcons
        name="arrow-back-ios-new"
        size={20}
        color={tintColor ?? Colors.text.strong}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.55,
  },
});
