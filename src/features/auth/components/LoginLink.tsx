import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import { AuthStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function LoginLink() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.linkContainer}>
      <Text style={styles.text}>Déjà inscrit ?</Text>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.action}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  action: {
    fontSize: 14,
    fontFamily: titleFontFamily,
    color: Colors.accent.primary,
  },
});
