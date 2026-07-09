import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
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
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  labelFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

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
  const { profile, loading, refresh } = useMatchaProfile();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const navigateFromAction = (action: MatchaProfileNextAction) => {
    if (action.route === 'BilanIntro') {
      navigation.navigate('BilanIntro', { mode: 'start' });
      return;
    }

    if (action.route === 'JobCompare') {
      navigation.navigate('JobCompare', { jobIds: action.jobIds ?? [] });
      return;
    }

    navigation.navigate(action.route);
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
  const recommendedJobs = profile.recommendedJobs;
  const likedJobs = profile.likedJobs;
  const [bilanTest, personalityTest, workStyleTest] = profile.tests;
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
                value={`${profile.completion}%`}
                label="profil complété"
              />
              <MetricCard
                value={`${profile.completedTests.total}/3`}
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

          <SectionTitle title="Tes dimensions clés" />
          <View style={styles.card}>
            {strengths.length ? (
              <>
                <Text style={styles.groupTitle}>Forces</Text>
                <View style={styles.pillList}>
                  {strengths.map((item) => (
                    <Pill key={item} label={item} />
                  ))}
                </View>
              </>
            ) : null}

            {values.length ? (
              <>
                <Text style={styles.groupTitle}>Valeurs et intérêts</Text>
                <View style={styles.pillList}>
                  {values.map((item) => (
                    <Pill key={item} label={item} />
                  ))}
                </View>
              </>
            ) : null}

            {environments.length ? (
              <>
                <Text style={styles.groupTitle}>Environnements favorables</Text>
                <View style={styles.pillList}>
                  {environments.map((item) => (
                    <Pill key={item} label={item} />
                  ))}
                </View>
              </>
            ) : null}

            {sectors.length ? (
              <>
                <Text style={styles.groupTitle}>Secteurs attirants</Text>
                <View style={styles.pillList}>
                  {sectors.map((item) => (
                    <Pill key={item} label={item} />
                  ))}
                </View>
              </>
            ) : null}

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
            {bilanTest ? (
              <TestSignalCard
                test={bilanTest}
                icon="psychology"
                onPress={() =>
                  navigation.navigate('BilanIntro', { mode: 'start' })
                }
              />
            ) : null}
            {personalityTest ? (
              <TestSignalCard
                test={personalityTest}
                icon="favorite-border"
                onPress={() => navigation.navigate('PersonalityIntro')}
              />
            ) : null}
            {workStyleTest ? (
              <TestSignalCard
                test={workStyleTest}
                icon="tune"
                onPress={() => navigation.navigate('WorkStyleIntro')}
              />
            ) : null}
          </View>

          <SectionTitle title="Métiers cohérents" />
          <View style={styles.card}>
            {recommendedJobs.length ? (
              <>
                <Text style={styles.groupTitle}>
                  Recommandés par tes résultats
                </Text>
                {recommendedJobs.map((job) => (
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

            {!recommendedJobs.length && !likedJobs.length ? (
              <Text style={styles.emptyText}>
                Aucun métier à croiser pour le moment. Termine l’auto-évaluation
                ou commence à swiper.
              </Text>
            ) : null}
          </View>

          <SectionTitle title="Prochaines actions" />
          <View style={styles.actionsCard}>
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
