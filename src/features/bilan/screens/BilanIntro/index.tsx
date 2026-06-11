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
import { BilanIntroMode, RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BilanIntro'>;
type IntroRoute = RouteProp<RootStackParamList, 'BilanIntro'>;

const benefitCards = [
  {
    title: 'Forces clés',
    subtitle: 'Ce que tu mobilises naturellement',
  },
  {
    title: 'Valeurs',
    subtitle: 'Ce qui compte vraiment dans ton travail',
  },
  {
    title: 'Environnements',
    subtitle: 'Les contextes où tu progresses le mieux',
  },
  {
    title: 'Pistes métiers',
    subtitle: 'Des idées concrètes à explorer',
  },
];

const firstRunFlow = [
  'Tu réponds avec honnêteté, sans chercher la bonne réponse',
  'On consolide tes forces, tes valeurs et tes préférences de travail',
  "Tu récupères une synthèse claire avec des pistes d'action",
];

export default function BilanIntroScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<IntroRoute>();
  const mode: BilanIntroMode = route.params?.mode ?? 'start';
  const isResume = mode === 'resume';

  return (
    <BackgroundRadial>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>
              {isResume ? 'POUR RAPPEL' : 'AUTO-ÉVALUATION PROFESSIONNELLE'}
            </Text>
            <Text style={styles.title}>
              {isResume
                ? 'Reprends ton auto-évaluation là où tu en étais'
                : 'Prendre du recul, concrètement'}
            </Text>
            <Text style={styles.subtitle}>
              {isResume
                ? "Ton brouillon est enregistré. Relis l'essentiel, puis reprends quand tu veux."
                : 'Une lecture structurée de ton profil professionnel pour mieux comprendre ce qui te porte aujourd&apos;hui et ce que tu peux explorer ensuite.'}
            </Text>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>~15 min</Text>
              <Text style={styles.quickStatLabel}>à ton rythme</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>Mixte</Text>
              <Text style={styles.quickStatLabel}>notes + réponses libres</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>Actionnable</Text>
              <Text style={styles.quickStatLabel}>synthèse utile</Text>
            </View>
          </View>

          {!isResume && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Comment ça se passe</Text>
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
              {benefitCards.map((item) => (
                <View key={item.title} style={styles.resultItem}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>À garder en tête</Text>
            <Text style={styles.note}>
              Cette auto-évaluation sert à clarifier une direction, pas à
              t&apos;enfermer dans une case. Le plus utile est de répondre
              simplement, en pensant à ta réalité actuelle.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('BilanQuestions')}
          >
            <Text style={styles.startButtonText}>
              {isResume
                ? "Reprendre l'auto-évaluation"
                : "Commencer l'auto-évaluation"}
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
    textAlign: 'center',
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
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
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
  startButton: {
    ...primaryButton,
    marginTop: 6,
  },
  startButtonText: {
    ...primaryButtonText,
    fontSize: 15,
    fontFamily: titleFontFamily,
  },
  note: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
});
