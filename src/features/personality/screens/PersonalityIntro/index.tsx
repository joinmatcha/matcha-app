import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
import { HomeStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'PersonalityIntro'>;
type IntroRoute = RouteProp<HomeStackParamList, 'PersonalityIntro'>;

const mbtiAxes = ['E / I', 'S / N', 'T / F', 'J / P'];

const firstRunFlow = [
  'Tu réponds vite et spontanément',
  'On calcule ton profil dominant',
  'Tu obtiens des pistes métier claires',
];

const resultCards = [
  {
    title: 'Ton type',
    subtitle: 'Un profil lisible',
  },
  {
    title: 'Tes forces',
    subtitle: 'Ce qui te porte',
  },
  {
    title: "Points d'attention",
    subtitle: 'Ce à quoi faire attention',
  },
  {
    title: 'Métiers cibles',
    subtitle: 'Des pistes concrètes',
  },
];

export default function PersonalityIntroScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<IntroRoute>();
  const hasDraft = !!route.params?.hasDraft;

  return (
    <BackgroundRadial>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>
              {hasDraft ? 'POUR RAPPEL' : 'TEST DE PERSONNALITÉ'}
            </Text>
            <Text style={styles.title}>
              {hasDraft
                ? "Reprends où tu t'es arrêté"
                : 'Mieux te connaître, vite'}
            </Text>
            <Text style={styles.subtitle}>
              {hasDraft
                ? "Ton brouillon est bien enregistré. Relis l'essentiel, puis continue."
                : 'Un test court pour comprendre ton style, ton énergie et les environnements qui te correspondent.'}
            </Text>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>24</Text>
              <Text style={styles.quickStatLabel}>questions</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>~3 min</Text>
              <Text style={styles.quickStatLabel}>à ton rythme</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>0</Text>
              <Text style={styles.quickStatLabel}>bonne réponse</Text>
            </View>
          </View>

          {!hasDraft && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Comment ça marche</Text>
              {firstRunFlow.map((step, index) => (
                <View key={step} style={styles.stepRow}>
                  <View style={styles.stepIndex}>
                    <Text style={styles.stepIndexText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ce que tu récupères</Text>
            <View style={styles.resultGrid}>
              {resultCards.map((item) => (
                <View key={item.title} style={styles.resultItem}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>MBTI en 20 secondes</Text>
            <Text style={styles.cardText}>
              Le modèle combine 4 axes de préférence. Leur combinaison forme 16
              profils.
            </Text>
            <View style={styles.axisRow}>
              {mbtiAxes.map((axis) => (
                <View key={axis} style={styles.axisPill}>
                  <Text style={styles.axisPillText}>{axis}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.note}>
              Résultat indicatif: utile pour te guider, pas pour t'enfermer.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('PersonalityTest')}
          >
            <Text style={styles.primaryButtonText}>
              {hasDraft ? 'Reprendre le test' : 'Commencer le test'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
  quickStats: {
    flexDirection: 'row',
    gap: 8,
  },
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
  card: {
    ...cardSurface,
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.base,
    marginBottom: 8,
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
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultItem: {
    width: '48%',
    backgroundColor: '#F6F8F7',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  resultTitle: {
    color: Colors.text.base,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: titleFontFamily,
  },
  resultSubtitle: {
    marginTop: 2,
    color: Colors.text.muted,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: bodyFontFamily,
  },
  cardText: {
    color: Colors.text.muted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
  },
  axisRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  axisPill: {
    backgroundColor: '#EEF4F1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  axisPillText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
  },
  note: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  primaryButton: {
    marginTop: 6,
    ...primaryButton,
  },
  primaryButtonText: {
    ...primaryButtonText,
    fontSize: 15,
    fontFamily: titleFontFamily,
  },
});
