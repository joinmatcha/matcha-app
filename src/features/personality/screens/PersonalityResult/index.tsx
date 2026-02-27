import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import { resetPersonalityTest } from '@/features/personality/api/personalityApi';
import PersonalityProfileHeader from '@/features/personality/components/PersonalityProfileHeader';
import ProfileSection from '@/features/personality/components/ProfileSection';
import RadarChart from '@/features/personality/components/RadarChart';
import TagList from '@/features/personality/components/TagList';
import { useAuth } from '@/hooks/useAuth';
import Colors from '@/themes/colors';
import { HomeStackParamList } from '@/types/navigation';

type ResultRoute = RouteProp<HomeStackParamList, 'PersonalityResult'>;
type ResultNav = NativeStackNavigationProp<
  HomeStackParamList,
  'PersonalityResult'
>;

export default function PersonalityResultScreen() {
  const route = useRoute<ResultRoute>();
  const navigation = useNavigation<ResultNav>();
  const { refreshUser } = useAuth();

  const { result } = route.params;

  const scrollY = useRef(new Animated.Value(0)).current;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, []);

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
    navigation.navigate('HomeMain');
  };

  const handleRedoTest = async () => {
    await resetPersonalityTest();
    await refreshUser();
    navigation.navigate('PersonalityTest');
  };

  return (
    <BackgroundRadial>
      <SafeAreaView style={styles.safeArea} />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
        >
          {/* HEADER */}
          <PersonalityProfileHeader
            label={result.label}
            type={result.type}
            showLogo={false}
          />

          {/* RADAR */}
          <View style={styles.card}>
            <RadarChart data={radarData} size={280} />
          </View>

          {/* DESCRIPTION */}
          <ProfileSection title="Description">
            <Text style={styles.description}>{result.description}</Text>
          </ProfileSection>

          {/* FORCES */}
          <ProfileSection title="Forces">
            <TagList items={result.strengths} variant="success" />
          </ProfileSection>

          {/* POINTS D'ATTENTION */}
          <ProfileSection title="Points d'attention">
            <TagList items={result.weaknesses} variant="warning" />
          </ProfileSection>

          {/* MÉTIERS */}
          <ProfileSection title="Métiers recommandés" isLast>
            <View style={styles.jobsList}>
              {result.recommendedJobs.map((job, i) => (
                <View key={i} style={styles.jobItem}>
                  <View style={styles.jobBullet} />
                  <Text style={styles.jobText}>{job}</Text>
                </View>
              ))}
            </View>
          </ProfileSection>

          <View style={styles.spacerLg} />

          {/* REFAIRE TEST */}
          <TouchableOpacity style={styles.redoButton} onPress={handleRedoTest}>
            <Text style={styles.redoButtonText}>Refaire le test</Text>
          </TouchableOpacity>

          <View style={styles.spacerMd} />

          {/* BOUTON RETOUR (REMPLACE FloatingActionButton) */}
          <TouchableOpacity style={styles.backButton} onPress={handleContinue}>
            <Text style={styles.backButtonText}>Retour à l'accueil</Text>
          </TouchableOpacity>

          <View style={styles.spacerLg} />
        </ScrollView>
      </View>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'transparent' },
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  spacerLg: { height: 40 },
  spacerMd: { height: 20 },

  card: {
    backgroundColor: Colors.background,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  description: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.greyDark.normal,
  },

  jobsList: { gap: 14 },
  jobItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  jobBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.greenLight.normal,
  },
  jobText: {
    fontSize: 16,
    color: Colors.greyDark.normal,
  },

  redoButton: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 12,
    alignSelf: 'center',

    borderWidth: 1,
    borderColor: Colors.greenDark.normal,

    backgroundColor: 'rgba(255,255,255,0.6)',
    shadowOpacity: 0,
  },

  redoButtonText: {
    color: Colors.greenDark.normal,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  backButton: {
    backgroundColor: Colors.greenDark.normal,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  backButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
