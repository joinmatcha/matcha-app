import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import Colors from '@/themes/colors';
import { HomeStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'BilanIntro'>;

export default function BilanIntroScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <BackgroundRadial>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.kicker}>Analyse professionnelle</Text>
          <Text style={styles.title}>Bilan de compétences Matcha</Text>
          <Text style={styles.subtitle}>
            Réponds à une série de questions pour obtenir une vision claire de
            tes forces, de tes valeurs et des environnements où tu peux
            t&apos;épanouir.
          </Text>

          <View style={styles.bulletCard}>
            <Text style={styles.bulletTitle}>Ce bilan va t&apos;aider à :</Text>
            <Text style={styles.bulletItem}>
              • Identifier tes compétences clés
            </Text>
            <Text style={styles.bulletItem}>
              • Clarifier ce qui est important pour toi au travail
            </Text>
            <Text style={styles.bulletItem}>
              • Explorer des pistes de métiers et d&apos;environnements
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('BilanQuestions')}
          >
            <Text style={styles.startButtonText}>Commencer le bilan</Text>
          </TouchableOpacity>

          <Text style={styles.helper}>
            Temps estimé : ~15 minutes. Tu peux le refaire plus tard si ton
            situation évolue.
          </Text>
        </View>
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  kicker: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#062314',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(0,0,0,0.6)',
    marginBottom: 24,
  },
  bulletCard: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 32,
  },
  bulletTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.greyDark.normal,
    marginBottom: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.7)',
    marginBottom: 4,
  },
  startButton: {
    backgroundColor: Colors.greenDark.normal,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  helper: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.55)',
    marginTop: 4,
  },
});
