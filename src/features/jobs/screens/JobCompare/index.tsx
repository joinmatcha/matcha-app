import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import {
  ComparedJob,
  JobComparison,
  MarketIndicatorSnapshot,
  compareJobs,
} from '@/features/jobs/api/jobsApi';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  displayFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import {
  cardSurface,
  primaryButton,
  primaryButtonText,
  secondaryButton,
  secondaryButtonText,
  softBadge,
  softBadgeText,
} from '@/themes/ui';
import { RootStackParamList } from '@/types/navigation';

type CompareRoute = RouteProp<RootStackParamList, 'JobCompare'>;
type CompareNav = NativeStackNavigationProp<RootStackParamList, 'JobCompare'>;

const firstDisplayableValue = (snapshot?: MarketIndicatorSnapshot) => {
  const value = snapshot?.values?.find(
    (item) =>
      typeof item.count === 'number' ||
      typeof item.amount === 'number' ||
      typeof item.rate === 'number' ||
      typeof item.decimal === 'number',
  );

  if (!value) return undefined;
  const numeric =
    value.count ?? value.amount ?? value.rate ?? value.decimal ?? undefined;
  if (typeof numeric !== 'number') return undefined;

  const formatted =
    typeof value.amount === 'number'
      ? `${Math.round(numeric).toLocaleString('fr-FR')} €`
      : numeric.toLocaleString('fr-FR');

  return [value.label || value.name, formatted].filter(Boolean).join(' : ');
};

const ScoreBadge = ({ score }: { score: number }) => (
  <View style={styles.scoreBadge}>
    <Text style={styles.scoreValue}>{score}%</Text>
  </View>
);

const getMarketItems = (job: ComparedJob) =>
  [
    firstDisplayableValue(job.market?.offers),
    firstDisplayableValue(job.market?.tension),
    firstDisplayableValue(job.market?.salary),
  ].filter((item): item is string => Boolean(item));

const ComparisonCriterion = ({
  title,
  jobs,
  getItems,
  empty,
}: {
  title: string;
  jobs: ComparedJob[];
  getItems: (job: ComparedJob) => string[];
  empty: string;
}) => {
  return (
    <View style={styles.criterionCard}>
      <Text style={styles.criterionTitle}>{title}</Text>
      <View style={styles.criterionRows}>
        {jobs.map((job) => {
          const items = getItems(job).filter(Boolean).slice(0, 3);

          return (
            <View key={job.id} style={styles.criterionRow}>
              <Text style={styles.rowJobTitle} numberOfLines={2}>
                {job.title}
              </Text>
              <View style={styles.rowContent}>
                {items.length ? (
                  items.map((item) => (
                    <Text key={item} style={styles.rowItem}>
                      {item}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.emptyLine}>{empty}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const ScoreOverview = ({
  jobs,
  onOpenDetail,
}: {
  jobs: ComparedJob[];
  onOpenDetail: (jobId: string) => void;
}) => {
  const bestScore = Math.max(...jobs.map((job) => job.matchScore));

  return (
    <View style={styles.scoreCard}>
      <Text style={styles.scoreCardTitle}>Scores de match</Text>
      <View style={styles.scoreRows}>
        {jobs.map((job) => (
          <View key={job.id} style={styles.scoreRow}>
            <View style={styles.scoreRowMain}>
              <View style={styles.scoreTitleRow}>
                <Text style={styles.scoreJobTitle} numberOfLines={2}>
                  {job.title}
                </Text>
                {job.matchScore === bestScore ? (
                  <Text style={styles.bestBadge}>Meilleur match</Text>
                ) : null}
              </View>
              {job.sector ? (
                <Text style={styles.scoreJobSector} numberOfLines={1}>
                  {job.sector}
                </Text>
              ) : null}
              <TouchableOpacity
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => onOpenDetail(job.id)}
              >
                <Text style={styles.detailLink}>Voir la fiche</Text>
              </TouchableOpacity>
            </View>
            <ScoreBadge score={job.matchScore} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default function JobCompareScreen() {
  const route = useRoute<CompareRoute>();
  const navigation = useNavigation<CompareNav>();
  const { jobIds } = route.params;
  const jobIdsKey = jobIds.join('|');

  const [comparison, setComparison] = useState<JobComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await compareJobs(jobIdsKey.split('|'));
        if (mounted) setComparison(result);
      } catch {
        if (mounted) {
          setComparison(null);
          setError('Impossible de comparer ces métiers pour le moment.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [jobIdsKey]);

  if (loading) {
    return (
      <BackgroundRadial>
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      </BackgroundRadial>
    );
  }

  if (error || !comparison) {
    return (
      <BackgroundRadial>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {error ?? 'Comparaison indisponible.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </BackgroundRadial>
    );
  }

  return (
    <BackgroundRadial>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>COMPARAISON</Text>
          <Text style={styles.heroTitle}>Comparer mes pistes métiers</Text>
        </View>

        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}>Base de comparaison</Text>
          <View style={styles.tagList}>
            {comparison.context.strengths.slice(0, 4).map((strength) => (
              <View key={strength} style={styles.contextTag}>
                <Text style={styles.contextTagText}>{strength}</Text>
              </View>
            ))}
            {comparison.context.workConditions.slice(0, 3).map((condition) => (
              <View key={condition} style={styles.contextTagAlt}>
                <Text style={styles.contextTagText}>{condition}</Text>
              </View>
            ))}
          </View>
        </View>

        <ScoreOverview
          jobs={comparison.jobs}
          onOpenDetail={(jobId) => navigation.navigate('JobDetail', { jobId })}
        />

        <View style={styles.criteriaStack}>
          <ComparisonCriterion
            title="Pourquoi ce métier ressort"
            jobs={comparison.jobs}
            getItems={(job) => job.matchReasons}
            empty="Pas assez d'indices."
          />
          <ComparisonCriterion
            title="Style professionnel"
            jobs={comparison.jobs}
            getItems={(job) =>
              job.workStyleCompatibility
                ? [
                    job.workStyleCompatibility.label,
                    ...job.workStyleCompatibility.reasons,
                  ]
                : []
            }
            empty="Passe le test Style professionnel pour obtenir ce signal."
          />
          <ComparisonCriterion
            title="Ce que tu as déjà"
            jobs={comparison.jobs}
            getItems={(job) => [
              ...job.matchedSkills,
              ...job.matchedWorkConditions,
            ]}
            empty="Aucun point direct identifié."
          />
          <ComparisonCriterion
            title="À développer"
            jobs={comparison.jobs}
            getItems={(job) => job.skillsToDevelop}
            empty="Pas d'écart majeur disponible."
          />
          <ComparisonCriterion
            title="Marché"
            jobs={comparison.jobs}
            getItems={getMarketItems}
            empty="Données marché indisponibles."
          />
          <ComparisonCriterion
            title="Accès au métier"
            jobs={comparison.jobs}
            getItems={(job) => (job.accessToJob ? [job.accessToJob] : [])}
            empty="Condition d'accès indisponible."
          />
          <ComparisonCriterion
            title="Prochaine action"
            jobs={comparison.jobs}
            getItems={(job) => [job.recommendedNextStep]}
            empty="Action non disponible."
          />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour aux résultats</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'transparent' },
  container: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    minHeight: 420,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  hero: {
    marginHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    letterSpacing: 1.1,
    color: Colors.accent.strong,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: displayFontFamily,
    color: Colors.text.strong,
  },
  contextCard: {
    ...cardSurface,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
  },
  contextTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 10,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contextTag: {
    ...softBadge,
  },
  contextTagAlt: {
    ...softBadge,
    backgroundColor: Colors.greenLight.light.normal,
  },
  contextTagText: {
    ...softBadgeText,
    color: Colors.accent.strong,
  },
  scoreCard: {
    ...cardSurface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },
  scoreCardTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 10,
  },
  scoreRows: {
    gap: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 14,
    backgroundColor: Colors.ui.surfaceSoft,
    padding: 12,
  },
  scoreRowMain: {
    flex: 1,
  },
  scoreTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  scoreJobTitle: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  bestBadge: {
    borderRadius: 999,
    backgroundColor: Colors.accent.soft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
  },
  scoreJobSector: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  detailLink: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.text.muted,
  },
  scoreBadge: {
    width: 58,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: Colors.accent.soft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
  },
  scoreValue: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '800',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
  },
  emptyLine: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  criteriaStack: {
    gap: 12,
    marginHorizontal: 20,
    marginTop: 14,
  },
  criterionCard: {
    ...cardSurface,
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  criterionTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 10,
  },
  criterionRows: {
    gap: 10,
  },
  criterionRow: {
    borderRadius: 14,
    backgroundColor: Colors.ui.surfaceSoft,
    padding: 12,
  },
  rowJobTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 8,
  },
  rowContent: {
    gap: 7,
  },
  rowItem: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  backButton: {
    ...primaryButton,
    marginHorizontal: 20,
    marginTop: 18,
  },
  backButtonText: {
    ...primaryButtonText,
  },
  retryButton: {
    ...secondaryButton,
    minWidth: 140,
    marginTop: 16,
  },
  retryButtonText: {
    ...secondaryButtonText,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 21,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  bottomSpacer: {
    height: 40,
  },
});
