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

import AppScreen from '@/components/layout/AppScreen';
import { resetPersonalityTest } from '@/features/personality/api/personalityApi';
import PersonalityProfileHeader from '@/features/personality/components/PersonalityProfileHeader';
import RadarChart from '@/features/personality/components/RadarChart';
import TagList from '@/features/personality/components/TagList';
import { useAuth } from '@/hooks/useAuth';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import {
  cardSurface,
  primaryButton,
  primaryButtonText,
  secondaryButton,
  secondaryButtonText,
} from '@/themes/ui';
import { RootStackParamList } from '@/types/navigation';

type ResultRoute = RouteProp<RootStackParamList, 'PersonalityResult'>;
type ResultNav = NativeStackNavigationProp<
  RootStackParamList,
  'PersonalityResult'
>;

export default function PersonalityResultScreen() {
  const route = useRoute<ResultRoute>();
  const navigation = useNavigation<ResultNav>();
  const { refreshUser } = useAuth();

  const { result } = route.params;

  const normalizeScore = (score: number) => (score + 12) / 24;

  const radarData = [
    { label: 'Créativité', value: normalizeScore(result.scoreBreakdown.SN) },
    { label: 'Initiative', value: normalizeScore(result.scoreBreakdown.EI) },
    { label: 'Rigueur', value: normalizeScore(result.scoreBreakdown.JP) },
    {
      label: 'Esprit pratique',
      value: normalizeScore(-result.scoreBreakdown.SN),
    },
    { label: 'Autonomie', value: normalizeScore(-result.scoreBreakdown.EI) },
    { label: 'Collaboration', value: normalizeScore(result.scoreBreakdown.TF) },
  ];

  const handleContinue = async () => {
    await refreshUser();
    navigation.navigate('Main', { screen: 'Home' });
  };

  const handleRedoTest = async () => {
    await resetPersonalityTest();
    await refreshUser();
    navigation.navigate('PersonalityIntro', { hasDraft: false });
  };

  const insightCards = [
    { label: 'Type', value: result.type ?? 'Profil' },
    { label: 'Forces clés', value: `${result.strengths.length}` },
    { label: 'Pistes métiers', value: `${result.recommendedJobs.length}` },
  ];

  return (
    <AppScreen>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea} />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <PersonalityProfileHeader
            label={result.label}
            type={result.type}
            showLogo={false}
          />

          <View style={styles.insightsRow}>
            {insightCards.map((item) => (
              <View key={item.label} style={styles.insightCard}>
                <Text style={styles.insightLabel}>{item.label}</Text>
                <Text style={styles.insightValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.blockHead}>
              <Text style={styles.blockTitle}>Ta dynamique globale</Text>
              <Text style={styles.blockSubtitle}>
                Lecture visuelle de tes tendances dominantes
              </Text>
            </View>
            <RadarChart data={radarData} size={280} />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{result.description}</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Forces</Text>
            <TagList items={result.strengths} variant="success" />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Points d'attention</Text>
            <TagList items={result.weaknesses} variant="warning" />
          </View>

          <View style={[styles.sectionCard, styles.lastSectionCard]}>
            <Text style={styles.sectionTitle}>Métiers recommandés</Text>
            <View style={styles.jobsList}>
              {result.recommendedJobs.map((job, i) => (
                <View key={i} style={styles.jobItem}>
                  <View style={styles.jobBullet} />
                  <Text style={styles.jobText}>{job}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.spacerLg} />

          <TouchableOpacity style={styles.redoButton} onPress={handleRedoTest}>
            <Text style={styles.redoButtonText}>Refaire le test</Text>
          </TouchableOpacity>

          <View style={styles.spacerMd} />

          <TouchableOpacity style={styles.backButton} onPress={handleContinue}>
            <Text style={styles.backButtonText}>Retour à l'accueil</Text>
          </TouchableOpacity>

          <View style={styles.spacerLg} />
        </ScrollView>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'transparent' },
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  spacerLg: { height: 40 },
  spacerMd: { height: 20 },
  insightsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  insightCard: {
    ...cardSurface,
    borderRadius: 8,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 11,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  insightValue: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: titleFontFamily,
    fontWeight: '400',
    color: Colors.text.strong,
  },

  card: {
    ...cardSurface,
    borderRadius: 8,
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  blockHead: {
    alignSelf: 'stretch',
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  blockTitle: {
    fontSize: 16,
    fontFamily: titleFontFamily,
    fontWeight: '600',
    color: '#232220',
    letterSpacing: 0,
  },
  blockSubtitle: {
    marginTop: 3,
    fontSize: 13,
    fontFamily: bodyFontFamily,
    color: '#5A534E',
  },
  sectionCard: {
    ...cardSurface,
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  lastSectionCard: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: titleFontFamily,
    fontWeight: '600',
    color: Colors.text.strong,
    marginBottom: 12,
    letterSpacing: 0,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },

  jobsList: { gap: 12 },
  jobItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  jobBullet: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: Colors.primary,
  },
  jobText: {
    fontSize: 15,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },

  redoButton: {
    ...secondaryButton,
    paddingVertical: 12,
    paddingHorizontal: 26,
    marginHorizontal: 14,
  },

  redoButtonText: {
    ...secondaryButtonText,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    letterSpacing: 0.1,
  },

  backButton: {
    ...primaryButton,
    marginHorizontal: 14,
  },
  backButtonText: {
    ...primaryButtonText,
    fontFamily: titleFontFamily,
    fontWeight: '600',
  },
});
