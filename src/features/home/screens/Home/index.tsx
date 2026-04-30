import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import { useBilan } from '@/features/bilan/hooks/useBilan';
import BilanSummaryCard from '@/features/home/components/BilanSummaryCard';
import PersonalitySummaryCard from '@/features/home/components/PersonalitySummaryCard';
import ProfileCompletionCard from '@/features/home/components/ProfileCompletionCard';
import SwipePreferencesCard from '@/features/home/components/SwipePreferencesCard';
import TestCard from '@/features/home/components/TestCard';
import TopLikedJobsCard from '@/features/home/components/TopLikedJobsCard';
import { TopLikedJob, getTopLikedJobs } from '@/features/jobs';
import { useProfile } from '@/features/profile/hooks/useProfile';
import {
  Preferences,
  getPreferences,
} from '@/features/swipe/api/preferencesApi';
import { useAuth } from '@/hooks/useAuth';
import { clearDraft, loadDraft } from '@/services/draftStorage';
import Colors from '@/themes/colors';
import { displayFontFamily, titleFontFamily } from '@/themes/typography';
import { HomeStackParamList, TabParamList } from '@/types/navigation';
import { computeProfileCompletion } from '@/utils/computeProfileCompletion';

type BilanDraftData = {
  answers: [string, number | string][];
};

type HomeNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const { user: authUser } = useAuth();
  const userId = authUser?.id;

  const { user, loading, error, refresh } = useProfile();
  const { bilan, error: bilanError, refreshBilan } = useBilan();
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [topLikedJobs, setTopLikedJobs] = useState<TopLikedJob[]>([]);

  const refreshPreferences = useCallback(async () => {
    try {
      const data = await getPreferences();
      setPreferences(data);
    } catch {
      // silencieux : la carte ne s'affiche pas si l'appel échoue
    }
  }, []);

  const refreshTopLikedJobs = useCallback(async () => {
    try {
      const data = await getTopLikedJobs(3);
      setTopLikedJobs(data.jobs);
    } catch {
      setTopLikedJobs([]);
    }
  }, []);

  const [hasPersonalityDraft, setHasPersonalityDraft] = useState(false);
  const [hasBilanDraft, setHasBilanDraft] = useState(false);
  const [hasStartedBilanDraft, setHasStartedBilanDraft] = useState(false);
  const [bilanDraftUpdatedAt, setBilanDraftUpdatedAt] = useState<number | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshBilan();
      refreshPreferences();
      refreshTopLikedJobs();

      const checkDraft = async () => {
        if (!userId) {
          setHasPersonalityDraft(false);
          setHasBilanDraft(false);
          setHasStartedBilanDraft(false);
          return;
        }

        const [personalityDraft, bilanDraft] = await Promise.all([
          loadDraft('personality', userId),
          loadDraft<BilanDraftData>('bilan', userId),
        ]);

        const bilanCreatedAtMs = bilan?.createdAt
          ? new Date(bilan.createdAt).getTime()
          : null;
        const draftIsStale =
          !!bilanDraft &&
          !!bilanCreatedAtMs &&
          bilanDraft.updatedAt <= bilanCreatedAtMs;

        if (draftIsStale) {
          await clearDraft('bilan', userId);
        }

        setHasPersonalityDraft(!!personalityDraft);
        setHasBilanDraft(!!bilanDraft && !draftIsStale);
        setHasStartedBilanDraft(
          !!bilanDraft && !draftIsStale && !!bilanDraft.data.answers.length,
        );
        setBilanDraftUpdatedAt(
          !!bilanDraft && !draftIsStale ? bilanDraft.updatedAt : null,
        );
      };

      checkDraft().catch(() => {});
    }, [
      refresh,
      refreshBilan,
      userId,
      refreshPreferences,
      refreshTopLikedJobs,
      bilan?.createdAt,
    ]),
  );

  if (loading) return null;

  if (error || !user) {
    return (
      <BackgroundRadial bubbles>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error ?? 'Impossible de charger les données utilisateur.'}
            </Text>
            <Button mode="contained" onPress={refresh}>
              Réessayer
            </Button>
          </View>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

  const completion = computeProfileCompletion(user);
  const bilanCreatedAtMs = bilan?.createdAt
    ? new Date(bilan.createdAt).getTime()
    : null;
  const draftIsStaleComparedToBilan =
    !!bilan &&
    !!bilanCreatedAtMs &&
    !!bilanDraftUpdatedAt &&
    bilanDraftUpdatedAt <= bilanCreatedAtMs;
  const shouldUseBilanDraft = hasBilanDraft && !draftIsStaleComparedToBilan;
  const hasBilan = !!bilan && !shouldUseBilanDraft;

  return (
    <BackgroundRadial bubbles>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.titleRow}>
              <Text style={styles.titleBase}>
                Bonjour <Text style={styles.titleAccent}>{user.firstName}</Text>
              </Text>
            </View>
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
            {user.personality ? (
              <PersonalitySummaryCard
                personality={user.personality}
                onPress={() =>
                  navigation.navigate('PersonalityResult', {
                    result: user.personality!,
                  })
                }
              />
            ) : (
              <TestCard
                title="Test de personnalité"
                description={
                  hasPersonalityDraft
                    ? 'Tu as un test en cours.'
                    : 'Découvre ton profil Matcha.'
                }
                buttonLabel={hasPersonalityDraft ? 'Reprendre' : 'Commencer'}
                onPress={() =>
                  navigation.navigate('PersonalityIntro', {
                    hasDraft: hasPersonalityDraft,
                  })
                }
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
                description={
                  shouldUseBilanDraft
                    ? hasStartedBilanDraft
                      ? 'Tu as un bilan en cours.'
                      : 'Analyse complète : forces, valeurs & métiers.'
                    : bilanError
                      ? 'Le bilan est indisponible pour le moment.'
                      : 'Analyse complète : forces, valeurs & métiers.'
                }
                buttonLabel={
                  shouldUseBilanDraft && hasStartedBilanDraft
                    ? 'Reprendre'
                    : 'Commencer'
                }
                onPress={() =>
                  navigation.navigate('BilanIntro', {
                    mode: shouldUseBilanDraft
                      ? hasStartedBilanDraft
                        ? 'resume'
                        : 'restart'
                      : 'start',
                  })
                }
              />
            )}

            {/* SECTION: Préférences métiers */}
            <Text style={styles.sectionTitle}>Préférences métiers</Text>
            <TopLikedJobsCard
              jobs={topLikedJobs}
              onJobPress={(jobId) =>
                navigation.navigate('JobDetail', { jobId })
              }
              onSwipePress={() => navigation.navigate('Swipe')}
            />

            {preferences !== null && (
              <>
                <SwipePreferencesCard
                  preferences={preferences}
                  onSwipePress={() => navigation.navigate('Swipe')}
                />
              </>
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
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    zIndex: 5,
  },
  titleRow: {
    width: '100%',
    marginBottom: 6,
  },
  titleBase: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: displayFontFamily,
    color: Colors.text.strong,
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  titleAccent: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: displayFontFamily,
    color: Colors.accent.primary,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.muted,
    lineHeight: 22,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginTop: 10,
    marginBottom: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#222',
    fontSize: 16,
  },
});
