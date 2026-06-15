import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  displayFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { cardSurface, primaryButton, primaryButtonText } from '@/themes/ui';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'WorkStyleIntro'>;

const steps = [
  'Tu réponds à 16 situations concrètes',
  'On identifie ton cadre de travail idéal',
  'On l’ajoute comme signal dans tes recommandations métier',
];

export default function WorkStyleIntroScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <BackgroundRadial>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>STYLE PROFESSIONNEL</Text>
            <Text style={styles.title}>Ton cadre de travail idéal</Text>
            <Text style={styles.subtitle}>
              Un test court pour comprendre les environnements dans lesquels tu
              avances avec le plus d’énergie et de clarté.
            </Text>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>16</Text>
              <Text style={styles.quickStatLabel}>questions</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>~2 min</Text>
              <Text style={styles.quickStatLabel}>à ton rythme</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>0</Text>
              <Text style={styles.quickStatLabel}>bonne réponse</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Comment ça marche</Text>
            {steps.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepIndex}>
                  <Text style={styles.stepIndexText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ce que tu récupères</Text>
            <Text style={styles.cardText}>
              Un profil clair, tes axes forts, des points d’attention et des
              conseils pour lire les fiches métier autrement.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pourquoi c’est utile</Text>
            <Text style={styles.cardText}>
              Ton résultat sera croisé avec ton profil, ton auto-évaluation
              professionnelle et tes métiers favoris pour mieux repérer les
              environnements qui te correspondent.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('WorkStyleQuestions')}
          >
            <Text style={styles.primaryButtonText}>Commencer le test</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  hero: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    letterSpacing: 1.1,
    color: Colors.accent.strong,
  },
  title: {
    marginTop: 6,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
    fontFamily: displayFontFamily,
    color: Colors.text.strong,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  quickStats: { flexDirection: 'row', gap: 8 },
  quickStat: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
  },
  quickStatLabel: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
    fontWeight: '600',
  },
  card: { ...cardSurface, padding: 16 },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.base,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  stepIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EAF4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndexText: {
    color: Colors.accent.strong,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: titleFontFamily,
  },
  stepText: {
    flex: 1,
    color: Colors.text.muted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
  },
  primaryButton: { ...primaryButton },
  primaryButtonText: { ...primaryButtonText },
});
