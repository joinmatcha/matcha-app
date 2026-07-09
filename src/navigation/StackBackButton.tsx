import { MaterialIcons } from '@expo/vector-icons';
import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackHeaderLeftProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Colors from '@/themes/colors';

export default function StackBackButton({
  canGoBack,
  tintColor,
}: NativeStackHeaderLeftProps) {
  const navigation = useNavigation();
  const route = useRoute();

  if (!canGoBack) return null;

  const goBack = () => {
    if (
      route.name === 'PersonalityResult' ||
      route.name === 'BilanResult' ||
      route.name === 'WorkStyleResult'
    ) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'Home' } }],
        }),
      );
      return;
    }

    navigation.goBack();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Revenir en arrière"
      hitSlop={12}
      onPress={goBack}
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
