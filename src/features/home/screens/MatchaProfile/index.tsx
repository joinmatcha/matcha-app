import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppScreen from '@/components/layout/AppScreen';
import MatchaButton from '@/components/ui/MatchaButton';
import {
  MatchaProfileJob,
  MatchaProfileNextAction,
  MatchaProfileTestCard,
} from '@/features/home/api/matchaProfileApi';
import { useMatchaProfile } from '@/features/home/hooks/useMatchaProfile';
import { useAuth } from '@/hooks/useAuth';
import { loadDraft } from '@/services/draftStorage';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  labelFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type IconName = keyof typeof MaterialIcons.glyphMap;
type BilanDraftData = {
  answers: [string, number | string][];
};
type NumericDraftData = {
  answers: [string, number][];
};
type DimensionGroupKey = 'strengths' | 'values' | 'environments' | 'sectors';
type ExpandedDimensionGroups = Record<DimensionGroupKey, boolean>;
type TopDimension = { label: string; icon: IconName };

const INK = '#101820';
const HOME_ACCENT = '#00513A';

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function DimensionSpotlight({
  label,
  icon,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <View style={styles.dimensionSpotlight}>
      <View style={styles.dimensionIcon}>
        <MaterialIcons name={icon} size={20} color={HOME_ACCENT} />
      </View>
      <Text style={styles.dimensionSpotlightText} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

function DimensionGroup({
  title,
  items,
  expanded,
  onToggle,
}: {
  title: string;
  items: string[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const visibleItems = expanded ? items : items.slice(0, 4);
  const remaining = Math.max(items.length - visibleItems.length, 0);

  if (!items.length) return null;

  return (
    <View style={styles.dimensionGroup}>
      <Text style={styles.dimensionGroupTitle}>{title}</Text>
      <View style={styles.pillList}>
        {visibleItems.map((item) => (
          <Pill key={item} label={item} />
        ))}
        {remaining > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Afficher ${remaining} dimensions supplémentaires pour ${title}`}
            hitSlop={6}
            onPress={onToggle}
            style={({ pressed }) => [
              styles.morePill,
              pressed && styles.morePillPressed,
            ]}
          >
            <Text style={styles.morePillText}>+{remaining}</Text>
          </Pressable>
        ) : expanded && items.length > 4 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Réduire les dimensions ${title}`}
            hitSlop={6}
            onPress={onToggle}
            style={({ pressed }) => [
              styles.morePill,
              pressed && styles.morePillPressed,
            ]}
          >
            <MaterialIcons
              name="keyboard-arrow-up"
              size={16}
              color={HOME_ACCENT}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function MetricCard({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function TestSignalCard({
  test,
  icon,
  onPress,
}: {
  test: MatchaProfileTestCard;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={styles.testCard}
      onPress={onPress}
    >
      <View style={styles.testIcon}>
        <MaterialIcons name={icon} size={24} color={HOME_ACCENT} />
      </View>
      <View style={styles.testCopy}>
        <Text style={styles.testEyebrow}>{test.label}</Text>
        <Text style={styles.testTitle} numberOfLines={2}>
          {test.title}
        </Text>
        <Text style={styles.testDescription} numberOfLines={2}>
          {test.description}
        </Text>
      </View>
      <View
        style={[styles.statusDot, test.completed && styles.statusDotDone]}
      />
    </TouchableOpacity>
  );
}

function JobRow({
  job,
  onPress,
}: {
  job: MatchaProfileJob & { meta?: string };
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={styles.jobRow}
      onPress={onPress}
    >
      <View style={styles.jobIcon}>
        <MaterialIcons name="work-outline" size={20} color={HOME_ACCENT} />
      </View>
      <View style={styles.jobCopy}>
        <Text style={styles.jobTitle} numberOfLines={2}>
          {job.title}
        </Text>
        {job.sector || job.meta ? (
          <Text style={styles.jobMeta} numberOfLines={1}>
            {job.sector ?? job.meta}
          </Text>
        ) : null}
      </View>
      <MaterialIcons name="arrow-forward" size={18} color={Colors.text.muted} />
    </TouchableOpacity>
  );
}

export default function MatchaProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const userId = user?.id;
  const { profile, loading, refresh } = useMatchaProfile();
  const [hasBilanDraft, setHasBilanDraft] = useState(false);
  const [hasPersonalityDraft, setHasPersonalityDraft] = useState(false);
  const [hasWorkStyleDraft, setHasWorkStyleDraft] = useState(false);
  const [expandedDimensionGroups, setExpandedDimensionGroups] =
    useState<ExpandedDimensionGroups>({
      strengths: false,
      values: false,
      environments: false,
      sectors: false,
    });

  useFocusEffect(
    useCallback(() => {
      refresh();

      let isActive = true;

      const checkDrafts = async () => {
        if (!userId) {
          if (isActive) {
            setHasBilanDraft(false);
            setHasPersonalityDraft(false);
            setHasWorkStyleDraft(false);
          }
          return;
        }

        const [bilanDraft, personalityDraft, workStyleDraft] =
          await Promise.all([
            loadDraft<BilanDraftData>('bilan', userId),
            loadDraft<NumericDraftData>('personality', userId),
            loadDraft<NumericDraftData>('work_style', userId),
          ]);

        if (isActive) {
          setHasBilanDraft(!!bilanDraft?.data.answers.length);
          setHasPersonalityDraft(!!personalityDraft?.data.answers.length);
          setHasWorkStyleDraft(!!workStyleDraft?.data.answers.length);
        }
      };

      checkDrafts().catch(() => {
        if (isActive) {
          setHasBilanDraft(false);
          setHasPersonalityDraft(false);
          setHasWorkStyleDraft(false);
        }
      });

      return () => {
        isActive = false;
      };
    }, [refresh, userId]),
  );

  const navigateFromAction = (action: MatchaProfileNextAction) => {
    if (action.route === 'BilanIntro') {
      if (hasBilanDraft) {
        navigation.navigate('BilanQuestions');
        return;
      }
      navigation.navigate('BilanIntro', { mode: 'start' });
      return;
    }

    if (action.route === 'PersonalityIntro' && hasPersonalityDraft) {
      navigation.navigate('PersonalityTest');
      return;
    }

    if (action.route === 'WorkStyleIntro' && hasWorkStyleDraft) {
      navigation.navigate('WorkStyleQuestions');
      return;
    }

    if (action.route === 'JobCompare') {
      navigation.navigate('JobCompare', { jobIds: action.jobIds ?? [] });
      return;
    }

    if (action.route === 'JobMatching') {
      navigation.navigate('JobMatching');
      return;
    }

    navigation.navigate(action.route);
  };
  const toggleDimensionGroup = (group: DimensionGroupKey) => {
    setExpandedDimensionGroups((current) => ({
      ...current,
      [group]: !current[group],
    }));
  };

  if (loading) {
    return (
      <AppScreen>
        <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
          <View style={styles.center}>
            <ActivityIndicator color={Colors.accent.primary} size="large" />
          </View>
        </SafeAreaView>
      </AppScreen>
    );
  }

  if (!profile) {
    return (
      <AppScreen>
        <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              Impossible de charger ton profil Matcha pour le moment.
            </Text>
            <MatchaButton label="Réessayer" onPress={refresh} />
          </View>
        </SafeAreaView>
      </AppScreen>
    );
  }

  const strengths = profile.keyDimensions.strengths;
  const values = profile.keyDimensions.values;
  const environments = profile.keyDimensions.environments;
  const sectors = profile.keyDimensions.sectors;
  const topDimensionCandidates: Array<TopDimension | null> = [
    strengths[0]
      ? { label: strengths[0], icon: 'auto-awesome' as const }
      : null,
    values[0] ? { label: values[0], icon: 'favorite-border' as const } : null,
    environments[0] ? { label: environments[0], icon: 'tune' as const } : null,
    sectors[0] ? { label: sectors[0], icon: 'explore' as const } : null,
  ];
  const topDimensions = topDimensionCandidates
    .filter((item): item is TopDimension => Boolean(item))
    .slice(0, 3);
  const matchedJobs = profile.matchedJobs;
  const likedJobs = profile.likedJobs;
  const [bilanTest, personalityTest, workStyleTest] = profile.tests;
  const buildAdjustedTest = (
    test: MatchaProfileTestCard | undefined,
    hasDraft: boolean,
  ) =>
    test
      ? {
          ...test,
          title: hasDraft ? 'En cours' : test.title,
          description: hasDraft
            ? "Reprends là où tu t'es arrêté."
            : test.description,
          completed: hasDraft ? false : test.completed,
        }
      : null;
  const adjustedBilanTest = buildAdjustedTest(bilanTest, hasBilanDraft);
  const adjustedPersonalityTest = buildAdjustedTest(
    personalityTest,
    hasPersonalityDraft,
  );
  const adjustedWorkStyleTest = buildAdjustedTest(
    workStyleTest,
    hasWorkStyleDraft,
  );
  const effectiveCompletedTests = {
    ...profile.completedTests,
    bilan: hasBilanDraft ? false : profile.completedTests.bilan,
    personality: hasPersonalityDraft
      ? false
      : profile.completedTests.personality,
    workStyle: hasWorkStyleDraft ? false : profile.completedTests.workStyle,
  };
  const effectiveCompletedTotal = [
    effectiveCompletedTests.bilan,
    effectiveCompletedTests.personality,
    effectiveCompletedTests.workStyle,
  ].filter(Boolean).length;
  const effectiveCompletion = Math.round((effectiveCompletedTotal / 3) * 100);
  const nextActionIsTest = [
    'BilanIntro',
    'PersonalityIntro',
    'WorkStyleIntro',
  ].includes(profile.nextBestAction.route);
  const likedJobsCount = likedJobs.reduce(
    (total, job) => total + (job.likesCount ?? 0),
    0,
  );

  return (
    <AppScreen>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>PROFIL MATCHA</Text>
            <Text style={styles.title}>Ce que Matcha comprend de toi</Text>
            <Text style={styles.subtitle}>{profile.mainProfile.summary}</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.profileLabel}>Synthèse actuelle</Text>
            <Text style={styles.profileTitle}>{profile.mainProfile.title}</Text>
            <View style={styles.metricsRow}>
              <MetricCard
                value={`${effectiveCompletion}%`}
                label="profil complété"
              />
              <MetricCard
                value={`${effectiveCompletedTotal}/3`}
                label="tests terminés"
              />
              <MetricCard value={likedJobsCount} label="métiers aimés" />
            </View>
          </View>

          <SectionTitle
            title="Signaux qui ressortent"
            subtitle="Les éléments qui reviennent dans tes tests et tes likes."
          />
          <View style={styles.card}>
            {profile.strongSignals.length ? (
              profile.strongSignals.map((signal) => (
                <View
                  key={`${signal.label}-${signal.sources.join('-')}`}
                  style={styles.signalRow}
                >
                  <View style={styles.signalBullet} />
                  <View style={styles.signalCopy}>
                    <Text style={styles.signalTitle}>{signal.label}</Text>
                    <Text style={styles.signalSource}>
                      {signal.sources.join(' + ')}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                Termine au moins un test ou aime quelques métiers pour faire
                ressortir tes signaux forts.
              </Text>
            )}
          </View>

          <SectionTitle
            title="Tes dimensions clés"
            subtitle="Les repères les plus utiles pour lire tes pistes métier."
          />
          <View style={styles.dimensionsCard}>
            {topDimensions.length ? (
              <View style={styles.dimensionSpotlightGrid}>
                {topDimensions.map((item) => (
                  <DimensionSpotlight
                    key={`${item.icon}-${item.label}`}
                    label={item.label}
                    icon={item.icon}
                  />
                ))}
              </View>
            ) : null}

            <DimensionGroup
              title="Forces"
              items={strengths}
              expanded={expandedDimensionGroups.strengths}
              onToggle={() => toggleDimensionGroup('strengths')}
            />
            <DimensionGroup
              title="Valeurs et intérêts"
              items={values}
              expanded={expandedDimensionGroups.values}
              onToggle={() => toggleDimensionGroup('values')}
            />
            <DimensionGroup
              title="Environnements favorables"
              items={environments}
              expanded={expandedDimensionGroups.environments}
              onToggle={() => toggleDimensionGroup('environments')}
            />
            <DimensionGroup
              title="Secteurs attirants"
              items={sectors}
              expanded={expandedDimensionGroups.sectors}
              onToggle={() => toggleDimensionGroup('sectors')}
            />

            {!strengths.length &&
            !values.length &&
            !environments.length &&
            !sectors.length ? (
              <Text style={styles.emptyText}>
                Ton profil est encore trop léger pour afficher une synthèse
                fiable.
              </Text>
            ) : null}
          </View>

          <SectionTitle
            title="Analyses utilisées"
            subtitle="Chaque test apporte un angle différent à ton profil."
          />
          <View style={styles.testStack}>
            {adjustedBilanTest ? (
              <TestSignalCard
                test={adjustedBilanTest}
                icon="psychology"
                onPress={() =>
                  hasBilanDraft
                    ? navigation.navigate('BilanQuestions')
                    : navigation.navigate('BilanIntro', { mode: 'start' })
                }
              />
            ) : null}
            {adjustedPersonalityTest ? (
              <TestSignalCard
                test={adjustedPersonalityTest}
                icon="favorite-border"
                onPress={() =>
                  hasPersonalityDraft
                    ? navigation.navigate('PersonalityTest')
                    : navigation.navigate('PersonalityIntro')
                }
              />
            ) : null}
            {adjustedWorkStyleTest ? (
              <TestSignalCard
                test={adjustedWorkStyleTest}
                icon="tune"
                onPress={() =>
                  hasWorkStyleDraft
                    ? navigation.navigate('WorkStyleQuestions')
                    : navigation.navigate('WorkStyleIntro')
                }
              />
            ) : null}
          </View>

          <SectionTitle title="Métiers cohérents" />
          <View style={styles.card}>
            {matchedJobs.length ? (
              <>
                <Text style={styles.groupTitle}>
                  Recommandés par tes résultats
                </Text>
                {matchedJobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={{
                      ...job,
                      meta:
                        typeof job.score === 'number'
                          ? `${job.score}% de cohérence`
                          : undefined,
                    }}
                    onPress={() =>
                      navigation.navigate('JobDetail', { jobId: job.id })
                    }
                  />
                ))}
              </>
            ) : null}

            {likedJobs.length ? (
              <>
                <Text style={styles.groupTitle}>
                  Favoris issus de tes likes
                </Text>
                {likedJobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={{
                      ...job,
                      meta:
                        typeof job.likesCount === 'number'
                          ? `${job.likesCount} like${
                              job.likesCount > 1 ? 's' : ''
                            }`
                          : undefined,
                    }}
                    onPress={() =>
                      navigation.navigate('JobDetail', { jobId: job.id })
                    }
                  />
                ))}
              </>
            ) : null}

            {!matchedJobs.length && !likedJobs.length ? (
              <Text style={styles.emptyText}>
                Aucun métier à croiser pour le moment. Termine l’auto-évaluation
                ou commence à swiper.
              </Text>
            ) : null}
          </View>

          <SectionTitle title="Prochaines actions" />
          <View style={styles.actionsCard}>
            {!nextActionIsTest ? (
              <MatchaButton
                label={profile.nextBestAction.label}
                variant="primary"
                fullWidth
                disabled={
                  profile.nextBestAction.route === 'JobCompare' &&
                  (profile.nextBestAction.jobIds?.length ?? 0) < 2
                }
                onPress={() => navigateFromAction(profile.nextBestAction)}
              />
            ) : null}
            <MatchaButton
              label="Voir mes métiers favoris"
              fullWidth
              onPress={() => navigation.navigate('CareerPreferences')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 46,
  },
  hero: {
    marginBottom: 16,
  },
  eyebrow: {
    marginBottom: 8,
    fontSize: 13,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  title: {
    fontSize: 27,
    lineHeight: 33,
    fontFamily: titleFontFamily,
    color: INK,
  },
  subtitle: {
    marginTop: 12,
    maxWidth: 322,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  profileCard: {
    marginBottom: 22,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.accent.border,
    shadowColor: '#22332C',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  profileLabel: {
    fontSize: 13,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  profileTitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 27,
    lineHeight: 32,
    fontFamily: titleFontFamily,
    color: INK,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.ui.surfaceSoft,
  },
  metricValue: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: titleFontFamily,
    color: HOME_ACCENT,
  },
  metricLabel: {
    marginTop: 3,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  sectionHeader: {
    marginTop: 4,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 19,
    lineHeight: 24,
    fontFamily: titleFontFamily,
    color: INK,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  card: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.accent.border,
  },
  dimensionsCard: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F7FBF7',
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.14)',
  },
  dimensionSpotlightGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  dimensionSpotlight: {
    flex: 1,
    minHeight: 100,
    minWidth: 0,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.10)',
  },
  dimensionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent.soft,
  },
  dimensionSpotlightText: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: titleFontFamily,
    color: INK,
  },
  dimensionGroup: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,81,58,0.08)',
  },
  dimensionGroupTitle: {
    marginBottom: 9,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  signalBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: HOME_ACCENT,
  },
  signalCopy: { flex: 1 },
  signalTitle: {
    fontSize: 16,
    fontFamily: titleFontFamily,
    color: INK,
  },
  signalSource: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  groupTitle: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: titleFontFamily,
    color: INK,
  },
  pillList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  pill: {
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.accent.soft,
  },
  pillText: {
    fontSize: 13,
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
  },
  morePill: {
    minWidth: 40,
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  morePillPressed: {
    opacity: 0.72,
  },
  morePillText: {
    fontSize: 13,
    fontFamily: titleFontFamily,
    color: HOME_ACCENT,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  testStack: {
    gap: 10,
    marginBottom: 20,
  },
  testCard: {
    minHeight: 92,
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.accent.border,
  },
  testIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent.soft,
  },
  testCopy: { flex: 1 },
  testEyebrow: {
    fontSize: 12,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  testTitle: {
    marginTop: 3,
    fontSize: 17,
    fontFamily: titleFontFamily,
    color: INK,
  },
  testDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D5DAD8',
  },
  statusDotDone: {
    backgroundColor: HOME_ACCENT,
  },
  jobRow: {
    minHeight: 78,
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.ui.surfaceSoft,
  },
  jobIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent.soft,
  },
  jobCopy: { flex: 1 },
  jobTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: titleFontFamily,
    color: INK,
  },
  jobMeta: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  actionsCard: {
    gap: 10,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.accent.border,
  },
});
