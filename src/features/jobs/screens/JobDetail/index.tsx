import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import {
  JobDetail,
  MarketIndicatorValue,
  RomeLabelCode,
  getJobById,
} from '@/features/jobs/api/jobsApi';
import { RootStackParamList } from '@/types/navigation';

import {
  ActivityStat,
  BulletList,
  ChipList,
  CompactList,
  InfoRows,
  ProfileInsight,
  SalaryDashboard,
  SectionCard,
  TensionTrend,
} from './components';
import { styles } from './styles';

type Route = RouteProp<RootStackParamList, 'JobDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const relationLabels: Record<string, string> = {
  close: 'Métier proche',
  possible: 'Transition possible',
};

const formatLabelCode = (item?: RomeLabelCode) =>
  [item?.code, item?.label].filter(Boolean).join(' - ');

const hasItems = <T,>(items?: T[]) => Boolean(items?.length);

const getRiasecLabel = (item: JobDetail['riasec'][number]) =>
  typeof item === 'string'
    ? item
    : item.label
      ? `${item.label}${item.code ? ` (${item.code})` : ''}`
      : item.code;

const getLabels = (items?: RomeLabelCode[]) =>
  (items ?? [])
    .map((item) => item.label || item.code)
    .filter((label): label is string => Boolean(label));

const isDisplayableTransitionDetail = (detail?: string) =>
  Boolean(detail && !/^EMPLOI_[A-Z_]+$/.test(detail));

const normalizeRomeText = (text?: string) =>
  (text ?? '').replace(/\\n/g, '\n').replace(/\s+\n/g, '\n').trim();

const splitRomeText = (text?: string) =>
  normalizeRomeText(text)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

const findMarketValue = (
  values: MarketIndicatorValue[] | undefined,
  codes: string[],
) => values?.find((value) => value.code && codes.includes(value.code));

const formatNumber = (value?: number) =>
  typeof value === 'number' ? value.toLocaleString('fr-FR') : undefined;

const formatCurrency = (value?: number) =>
  typeof value === 'number'
    ? `${Math.round(value).toLocaleString('fr-FR')} €`
    : undefined;

const getTensionLabel = (value?: number) => {
  if (typeof value !== 'number') return undefined;
  if (value <= 1) return 'Faible';
  if (value === 2) return 'Modérée';
  if (value === 3) return 'Moyenne';
  if (value === 4) return 'Forte';
  return 'Très forte';
};

const getTensionHelper = (value?: number) => {
  if (typeof value !== 'number') return undefined;
  if (value <= 1) return 'Peu de tension signalée sur ce métier';
  if (value === 2) return 'Tension limitée, quelques difficultés possibles';
  if (value === 3) return 'Tension intermédiaire sur le recrutement';
  if (value === 4) return 'Tension forte, profils plus rares';
  return 'Très forte tension, recrutement difficile';
};

export default function JobDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { jobId } = params;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getJobById(jobId);
        if (mounted) {
          setJob(res.job);
        }
      } catch {
        if (mounted) setJob(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [jobId]);

  const transitionTags = useMemo(() => {
    if (!job?.transitions) return [];

    return [
      job.transitions.ecological ? 'Transition écologique' : null,
      job.transitions.digital ? 'Transition numérique' : null,
      job.transitions.demographic ? 'Transition démographique' : null,
    ].filter((tag): tag is string => Boolean(tag));
  }, [job?.transitions]);

  if (loading) {
    return (
      <BackgroundRadial>
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      </BackgroundRadial>
    );
  }

  if (!job) {
    return (
      <BackgroundRadial>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Impossible de charger le métier.</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </BackgroundRadial>
    );
  }

  const definition = normalizeRomeText(job.definition || job.description);
  const definitionLines = splitRomeText(definition);
  const definitionPreview =
    definitionLines.length > 1 ? definitionLines.slice(0, 4) : [];
  const definitionParagraph =
    definitionLines.length === 1 ? definitionLines[0] : undefined;
  const accessLines = splitRomeText(job.accessToJob);
  const skillGroups = hasItems(job.skillGroups)
    ? job.skillGroups
    : hasItems(job.skills)
      ? [{ group: undefined, skills: job.skills }]
      : [];
  const knowledgeGroups = hasItems(job.knowledgeGroups)
    ? job.knowledgeGroups
    : hasItems(job.knowledge)
      ? [{ category: undefined, knowledge: job.knowledge }]
      : [];
  const domainItems = [
    formatLabelCode(job.domain),
    job.domain?.grandDomain
      ? `Grand domaine : ${formatLabelCode(job.domain.grandDomain)}`
      : null,
  ].filter((item): item is string => Boolean(item));
  const riasecLabels = job.riasec.map(getRiasecLabel).filter(Boolean);
  const sectorLabels = getLabels(job.sectors);
  const interestLabels = getLabels(job.interests);
  const trainingLabels = getLabels(job.trainingCodes);
  const mainAppellations = job.appellations
    .filter((appellation) => appellation.isMain)
    .slice(0, 4);
  const displayedAppellations = (
    mainAppellations.length ? mainAppellations : job.appellations.slice(0, 4)
  ).map((appellation) => appellation.shortLabel || appellation.label);
  const displayedSkillGroups = skillGroups.slice(0, 2);
  const displayedKnowledgeGroups = knowledgeGroups.slice(0, 2);
  const displayedRelatedJobs = job.relatedJobs.slice(0, 4);
  const displayableTransitionDetail = isDisplayableTransitionDetail(
    job.transitions?.ecologicalDetail,
  )
    ? job.transitions?.ecologicalDetail
    : undefined;
  const mainHeroTags = [
    job.sector,
    job.isRegulated ? 'Métier réglementé' : null,
    job.isExecutive ? 'Emploi cadre' : null,
  ].filter((tag): tag is string => Boolean(tag));
  const statItems = [
    job.domain?.label ? { label: 'Domaine', value: job.domain.label } : null,
    job.isRegulated !== undefined
      ? {
          label: 'Réglementation',
          value: job.isRegulated ? 'Réglementé' : 'Non réglementé',
        }
      : null,
    job.isExecutive !== undefined
      ? {
          label: 'Statut',
          value: job.isExecutive ? 'Cadre' : 'Non cadre',
        }
      : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
  const salaryAverage = findMarketValue(job.market?.salary?.values, [
    'SAL3',
    'SAL_3',
  ]);
  const salaryBeginner = findMarketValue(job.market?.salary?.values, [
    'SAL1',
    'SAL_1',
  ]);
  const salaryExperienced = findMarketValue(job.market?.salary?.values, [
    'SAL2',
    'SAL_2',
  ]);
  const totalOffersQuarter = findMarketValue(job.market?.offers?.values, [
    'TOFF',
  ]);
  const totalOffers12Months = findMarketValue(job.market?.offers?.values, [
    'TOFF-CUMUL12MOIS',
  ]);
  const hires12MonthsOrQuarter = findMarketValue(job.market?.hires?.values, [
    'TOUT-TOUTE',
  ]);
  const demandersAll = findMarketValue(job.market?.demanders?.values, [
    'ABCDEFG',
  ]);
  const mainTension = findMarketValue(job.market?.tension?.values, [
    'PERSPECTIVE',
  ]);
  const salaryAverageValue = formatCurrency(salaryAverage?.amount);
  const salaryBeginnerValue = formatCurrency(salaryBeginner?.amount);
  const salaryExperiencedValue = formatCurrency(salaryExperienced?.amount);
  const offerQuarterValue = formatNumber(totalOffersQuarter?.count);
  const offer12MonthsValue = formatNumber(totalOffers12Months?.count);
  const hiresValue = formatNumber(hires12MonthsOrQuarter?.count);
  const demandersValue = formatNumber(demandersAll?.count);
  const tensionValue =
    typeof mainTension?.count === 'number' ? `${mainTension.count}/5` : null;
  const tensionLabel = getTensionLabel(mainTension?.count);
  const tensionHelper = getTensionHelper(mainTension?.count);
  const hasMarketData = Boolean(
    salaryAverageValue ||
    salaryBeginnerValue ||
    salaryExperiencedValue ||
    offerQuarterValue ||
    offer12MonthsValue ||
    hiresValue ||
    demandersValue ||
    tensionValue,
  );
  const marketPeriod =
    job.market?.offers?.periodLabel ||
    job.market?.hires?.periodLabel ||
    job.market?.salary?.periodLabel;

  return (
    <BackgroundRadial>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {job.code ? (
            <Text style={styles.romeCode}>ROME {job.code}</Text>
          ) : null}
          <Text style={styles.title}>{job.title}</Text>

          <ChipList items={mainHeroTags} limit={3} />
        </View>

        {definition ? (
          <SectionCard title="À retenir">
            {definitionPreview.length ? (
              <BulletList items={definitionPreview} />
            ) : (
              <Text style={styles.bodyText}>{definitionParagraph}</Text>
            )}
          </SectionCard>
        ) : null}

        {job.workStyleCompatibility ? (
          <SectionCard title="Style professionnel">
            <Text style={styles.bodyText}>
              {job.workStyleCompatibility.label}
            </Text>
            <BulletList items={job.workStyleCompatibility.reasons} />
          </SectionCard>
        ) : null}

        {statItems.length ? (
          <View style={styles.statGrid}>
            {statItems.map((item) => (
              <View key={item.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {hasMarketData ? (
          <SectionCard title="Marché de l’emploi">
            <View style={styles.dashboardStack}>
              {salaryAverageValue ? (
                <SalaryDashboard
                  average={salaryAverageValue}
                  beginner={salaryBeginnerValue}
                  experienced={salaryExperiencedValue}
                  period={job.market?.salary?.periodLabel}
                />
              ) : null}

              {typeof mainTension?.count === 'number' ? (
                <TensionTrend
                  value={mainTension.count}
                  label={tensionLabel}
                  helper={tensionHelper}
                />
              ) : null}

              {offerQuarterValue ||
              offer12MonthsValue ||
              hiresValue ||
              demandersValue ? (
                <View style={styles.activityPanel}>
                  <Text style={styles.activityPanelTitle}>
                    Activité du marché
                  </Text>
                  <View style={styles.activityList}>
                    {offerQuarterValue ? (
                      <ActivityStat
                        label="Offres publiées"
                        value={offerQuarterValue}
                        helper={
                          totalOffersQuarter?.periodLabel ?? 'Sur le trimestre'
                        }
                      />
                    ) : null}
                    {offer12MonthsValue ? (
                      <ActivityStat
                        label="Offres sur 12 mois"
                        value={offer12MonthsValue}
                        helper="Total cumulé"
                      />
                    ) : null}
                    {hiresValue ? (
                      <ActivityStat
                        label="Embauches"
                        value={hiresValue}
                        helper="Recrutements enregistrés"
                      />
                    ) : null}
                    {demandersValue ? (
                      <ActivityStat
                        label="Candidats disponibles"
                        value={demandersValue}
                        helper="Demandeurs d’emploi sur ce métier"
                      />
                    ) : null}
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.marketSourceRow}>
              {job.market?.territory?.label || job.market?.territory?.code ? (
                <View style={styles.marketSourcePill}>
                  <Text style={styles.marketSourceLabel}>Territoire</Text>
                  <Text style={styles.marketSourceValue}>
                    {job.market.territory.label ??
                      (job.market.territory.code === 'FR'
                        ? 'France'
                        : job.market.territory.code)}
                  </Text>
                </View>
              ) : null}
              {marketPeriod ? (
                <View style={styles.marketSourcePill}>
                  <Text style={styles.marketSourceLabel}>Période</Text>
                  <Text style={styles.marketSourceValue}>{marketPeriod}</Text>
                </View>
              ) : null}
            </View>
          </SectionCard>
        ) : null}

        {accessLines.length ? (
          <SectionCard title="Accès au métier">
            {accessLines.length > 1 ? (
              <BulletList items={accessLines.slice(0, 4)} />
            ) : (
              <Text style={styles.bodyText}>{accessLines[0]}</Text>
            )}
          </SectionCard>
        ) : null}

        {domainItems.length ? (
          <SectionCard title="Domaine" compact>
            <InfoRows
              rows={[
                {
                  label: 'Domaine',
                  value: job.domain
                    ? [job.domain.code, job.domain.label]
                        .filter(Boolean)
                        .join(' - ')
                    : undefined,
                },
                {
                  label: 'Grand domaine',
                  value: job.domain?.grandDomain
                    ? formatLabelCode(job.domain.grandDomain)
                    : undefined,
                },
              ]}
            />
          </SectionCard>
        ) : null}

        {hasItems(riasecLabels) || hasItems(interestLabels) ? (
          <SectionCard title="Profil d’intérêt">
            <ProfileInsight riasec={riasecLabels} interests={interestLabels} />
          </SectionCard>
        ) : null}

        {hasItems(displayedAppellations) ? (
          <SectionCard title="Appellations fréquentes" compact>
            <CompactList
              items={displayedAppellations.map((appellation) => ({
                title: appellation,
              }))}
              limit={4}
            />
          </SectionCard>
        ) : null}

        {hasItems(displayedSkillGroups) ? (
          <SectionCard title="Compétences clés">
            <View style={styles.groupList}>
              {displayedSkillGroups.map((group, groupIndex) => (
                <View
                  key={`${group.group?.code ?? group.group?.label ?? 'skills'}-${groupIndex}`}
                  style={styles.groupCard}
                >
                  {group.group?.label || group.group?.code ? (
                    <Text style={styles.groupTitle}>
                      {formatLabelCode(group.group)}
                    </Text>
                  ) : null}

                  <View style={styles.skillList}>
                    {group.skills.slice(0, 2).map((skill, index) => (
                      <View
                        key={`${skill.code ?? skill.label}-${index}`}
                        style={styles.skillRow}
                      >
                        <View style={styles.skillMarker} />
                        <Text style={styles.skillText}>{skill.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </SectionCard>
        ) : null}

        {hasItems(displayedKnowledgeGroups) ? (
          <SectionCard title="Savoirs utiles">
            <View style={styles.groupList}>
              {displayedKnowledgeGroups.map((group, groupIndex) => (
                <View
                  key={`${group.category?.code ?? group.category?.label ?? 'knowledge'}-${groupIndex}`}
                  style={styles.groupCard}
                >
                  {group.category?.label || group.category?.code ? (
                    <Text style={styles.groupTitle}>
                      {formatLabelCode(group.category)}
                    </Text>
                  ) : null}

                  <CompactList
                    items={group.knowledge.map((knowledge) => ({
                      title: knowledge.label,
                    }))}
                    limit={4}
                  />
                </View>
              ))}
            </View>
          </SectionCard>
        ) : null}

        {hasItems(job.workContexts) ? (
          <SectionCard title="Contextes de travail" compact>
            <CompactList
              items={job.workContexts.map((context) => ({
                title: context.label,
              }))}
              limit={6}
            />
          </SectionCard>
        ) : null}

        {hasItems(sectorLabels) ? (
          <SectionCard title="Secteurs" compact>
            <CompactList
              items={sectorLabels.map((sector) => ({ title: sector }))}
              limit={5}
            />
          </SectionCard>
        ) : null}

        {hasItems(trainingLabels) ? (
          <SectionCard title="Formations associées" compact>
            <CompactList
              items={trainingLabels.map((training) => ({ title: training }))}
              limit={5}
            />
          </SectionCard>
        ) : null}

        {hasItems(displayedRelatedJobs) ? (
          <SectionCard title="Métiers proches">
            <View style={styles.groupList}>
              {displayedRelatedJobs.map((related, index) => (
                <View
                  key={`${related.code ?? related.label}-${index}`}
                  style={styles.relatedCard}
                >
                  <Text style={styles.relatedTitle}>
                    {[related.code, related.label].filter(Boolean).join(' - ')}
                  </Text>
                  <Text style={styles.relatedMeta}>
                    {relationLabels[related.relation] ?? related.relation}
                  </Text>
                </View>
              ))}
            </View>
          </SectionCard>
        ) : null}

        {transitionTags.length || displayableTransitionDetail ? (
          <SectionCard title="Transitions" compact>
            {transitionTags.length ? (
              <CompactList
                items={transitionTags.map((transition) => ({
                  title: transition,
                }))}
              />
            ) : null}
            {displayableTransitionDetail ? (
              <Text style={styles.bodyText}>{displayableTransitionDetail}</Text>
            ) : null}
          </SectionCard>
        ) : null}

        {job.lastSyncedAt ? (
          <Text style={styles.syncedAt}>
            Données synchronisées le{' '}
            {new Date(job.lastSyncedAt).toLocaleDateString('fr-FR')}
          </Text>
        ) : null}

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.backToBilanButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.backToBilanText}>Retour</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </BackgroundRadial>
  );
}
