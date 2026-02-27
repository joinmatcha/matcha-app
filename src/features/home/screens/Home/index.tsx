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
import { useProfile } from '@/features/profile/hooks/useProfile';
import {
  Preferences,
  getPreferences,
} from '@/features/swipe/api/preferencesApi';
import { useAuth } from '@/hooks/useAuth';
import { loadDraft } from '@/services/draftStorage';
import { HomeStackParamList, TabParamList } from '@/types/navigation';
import { computeProfileCompletion } from '@/utils/computeProfileCompletion';

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

  const refreshPreferences = useCallback(async () => {
    try {
      const data = await getPreferences();
      setPreferences(data);
    } catch {
      // silencieux : la carte ne s'affiche pas si l'appel échoue
    }
  }, []);

  const [hasPersonalityDraft, setHasPersonalityDraft] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshBilan();
      refreshPreferences();

      const checkDraft = async () => {
        if (!userId) {
          setHasPersonalityDraft(false);
          return;
        }

        const draft = await loadDraft('personality', userId);
        setHasPersonalityDraft(!!draft);
      };

      checkDraft().catch(() => {});
    }, [refresh, refreshBilan, userId, refreshPreferences]),
  );

  if (loading) return null;

  if (error || !user) {
    return (
      <BackgroundRadial bubbles>
        <SafeAreaView style={styles.safeArea}>
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
  const hasBilan = !!bilan;

  return (
    <BackgroundRadial bubbles>
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
                description={
                  bilanError
                    ? 'Le bilan est indisponible pour le moment.'
                    : 'Analyse complète : forces, valeurs & métiers.'
                }
                buttonLabel="Commencer"
                onPress={() => navigation.navigate('BilanIntro')}
              />
            )}

            {/* SECTION: Préférences métiers */}
            {preferences !== null && (
              <>
                <Text style={styles.sectionTitle}>Préférences métiers</Text>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#444',
    fontSize: 16,
  },
});
