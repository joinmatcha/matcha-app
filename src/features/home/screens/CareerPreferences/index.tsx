import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import { TopLikedJob, getTopLikedJobs } from '@/features/jobs';
import {
  Preferences,
  getPreferences,
} from '@/features/swipe/api/preferencesApi';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  labelFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const HOME_ACCENT = '#00513A';
const INK = '#101820';
const MUTED = '#5A626D';

function SignalPill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function JobRow({
  job,
  index,
  onPress,
}: {
  job: TopLikedJob;
  index: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={styles.jobRow}
      onPress={onPress}
    >
      <View style={styles.rank}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>

      <View style={styles.jobBody}>
        <Text style={styles.jobTitle} numberOfLines={2}>
          {job.title}
        </Text>
        {job.sector ? (
          <Text style={styles.jobSector} numberOfLines={1}>
            {job.sector}
          </Text>
        ) : null}
        {job.code ? (
          <Text style={styles.jobCode} numberOfLines={1}>
            ROME {job.code}
          </Text>
        ) : null}
      </View>

      <View style={styles.likesBadge}>
        <Text style={styles.likesText}>
          {job.likesCount} like{job.likesCount > 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CareerPreferencesScreen() {
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState(true);
  const [topLikedJobs, setTopLikedJobs] = useState<TopLikedJob[]>([]);
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        setLoading(true);

        const [jobsResult, preferencesResult] = await Promise.allSettled([
          getTopLikedJobs(10),
          getPreferences(),
        ]);

        if (!isActive) return;

        setTopLikedJobs(
          jobsResult.status === 'fulfilled' ? jobsResult.value.jobs : [],
        );
        setPreferences(
          preferencesResult.status === 'fulfilled'
            ? preferencesResult.value
            : null,
        );
        setLoading(false);
      };

      loadData().catch(() => {
        if (!isActive) return;
        setTopLikedJobs([]);
        setPreferences(null);
        setLoading(false);
      });

      return () => {
        isActive = false;
      };
    }, []),
  );

  const totalLikes = preferences?.totalLikes ?? topLikedJobs.length;
  const sectors = preferences?.topSectors.slice(0, 6) ?? [];
  const competences = preferences?.topCompetences.slice(0, 6) ?? [];

  return (
    <BackgroundRadial bubbles>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Préférences métiers</Text>
          <Text style={styles.title}>Tes métiers favoris</Text>
          <Text style={styles.subtitle}>
            Retrouve les métiers que tu as aimés et les signaux qui ressortent
            de tes choix.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Métiers aimés</Text>
            <Text style={styles.summaryValue}>{totalLikes}</Text>
          </View>
          <View style={styles.summaryIcon}>
            <MaterialIcons name="favorite" size={28} color={HOME_ACCENT} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Top métiers</Text>

          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={Colors.accent.primary} />
            </View>
          ) : topLikedJobs.length > 0 ? (
            <View style={styles.jobList}>
              {topLikedJobs.map((job, index) => (
                <JobRow
                  key={job.id}
                  job={job}
                  index={index}
                  onPress={() =>
                    navigation.navigate('JobDetail', { jobId: job.id })
                  }
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              Tu n’as pas encore de métier favori. Swipe quelques fiches pour
              construire ton top.
            </Text>
          )}
        </View>

        {(sectors.length > 0 || competences.length > 0) && (
          <View style={styles.card}>
            {sectors.length > 0 && (
              <View style={styles.signalBlock}>
                <Text style={styles.sectionTitle}>Secteurs favoris</Text>
                <View style={styles.pills}>
                  {sectors.map((sector) => (
                    <SignalPill key={sector.key} label={sector.key} />
                  ))}
                </View>
              </View>
            )}

            {competences.length > 0 && (
              <View style={styles.signalBlock}>
                <Text style={styles.sectionTitle}>Compétences recherchées</Text>
                <View style={styles.pills}>
                  {competences.map((competence) => (
                    <SignalPill key={competence.key} label={competence.key} />
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Main', { screen: 'Swipe' })}
        >
          <Text style={styles.primaryButtonText}>Continuer à swiper</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 52,
  },
  header: {
    marginBottom: 18,
  },
  eyebrow: {
    marginBottom: 8,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  title: {
    fontSize: 31,
    lineHeight: 36,
    fontFamily: titleFontFamily,
    color: INK,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: bodyFontFamily,
    color: MUTED,
  },
  summaryCard: {
    marginBottom: 14,
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DDEDE4',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  summaryValue: {
    marginTop: 2,
    fontSize: 34,
    lineHeight: 40,
    fontFamily: titleFontFamily,
    color: INK,
  },
  summaryIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.58)',
  },
  card: {
    marginBottom: 14,
    padding: 18,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.94)',
    shadowColor: '#22332C',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    lineHeight: 23,
    fontFamily: titleFontFamily,
    color: INK,
  },
  loader: {
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobList: {
    gap: 10,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F6F4',
  },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HOME_ACCENT,
  },
  rankText: {
    fontSize: 14,
    fontFamily: titleFontFamily,
    color: '#FFFFFF',
  },
  jobBody: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: titleFontFamily,
    color: INK,
  },
  jobSector: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: MUTED,
  },
  jobCode: {
    marginTop: 4,
    fontSize: 11,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  likesBadge: {
    flexShrink: 0,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#DDEDE4',
  },
  likesText: {
    fontSize: 12,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: bodyFontFamily,
    color: MUTED,
  },
  signalBlock: {
    marginBottom: 16,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    maxWidth: '100%',
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 17,
    backgroundColor: '#EEF4F0',
  },
  pillText: {
    fontSize: 13,
    lineHeight: 17,
    fontFamily: labelFontFamily,
    color: INK,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: HOME_ACCENT,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: titleFontFamily,
    color: '#FFFFFF',
  },
});
