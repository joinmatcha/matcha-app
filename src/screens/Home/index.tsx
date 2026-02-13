import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundBubbles from '@/components/Background/BackgroundBubbles';
import BackgroundRadial from '@/components/Background/BackgroundRadial';
import BilanSummaryCard from '@/components/Bilan/BilanSummaryCard';
import PersonalitySummaryCard from '@/components/Home/PersonalitySummaryCard';
import ProfileCompletionCard from '@/components/Home/ProfileCompletionCard';
import TestCard from '@/components/Home/TestCard';
import { useBilan } from '@/hooks/useBilan';
import { useProfile } from '@/hooks/useProfile';
import { computeProfileCompletion } from '@/utils/computeProfileCompletion';

export default function HomeScreen({ navigation }: any) {
  const { user, loading, refresh } = useProfile();
  const { bilan, refreshBilan } = useBilan();

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshBilan();
    }, [refresh, refreshBilan]),
  );

  if (loading || !user) return null;

  const completion = computeProfileCompletion(user);
  const hasPersonality = !!user.personality;
  const hasBilan = !!bilan;

  return (
    <BackgroundRadial>
      <View style={styles.bubblesLayer} pointerEvents="none">
        <BackgroundBubbles />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* HEADER */}
            <Text style={styles.title}>Bonjour {user.firstName}</Text>
            <Text style={styles.subtitle}>
              Voici un aperçu de ton profil Matcha.
            </Text>

            {/* PROFILE COMPLETION */}
            <ProfileCompletionCard
              completion={completion}
              onPress={() => navigation.navigate('Profil')}
            />

            {/* SECTION: Tests & analyses */}
            <Text style={styles.sectionTitle}>Tests & analyses</Text>

            {/* PERSONALITY */}
            {hasPersonality ? (
              <PersonalitySummaryCard
                personality={user.personality}
                onPress={() =>
                  navigation.navigate('PersonalityResult', {
                    result: user.personality,
                  })
                }
              />
            ) : (
              <TestCard
                title="Test de personnalité"
                description="Découvre ton profil Matcha."
                onPress={() => navigation.navigate('PersonalityTest')}
              />
            )}

            {/* BILAN DE COMPÉTENCES */}
            {hasBilan ? (
              <BilanSummaryCard
                bilan={bilan}
                onPress={() => navigation.navigate('BilanResult', { bilan })}
              />
            ) : (
              <TestCard
                title="Bilan de compétences"
                description="Analyse complète : forces, valeurs & métiers."
                onPress={() => navigation.navigate('BilanIntro')}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bubblesLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    zIndex: 5,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#062314',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.55)',
    lineHeight: 22,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#062314',
    marginTop: 10,
    marginBottom: 12,
  },
});
