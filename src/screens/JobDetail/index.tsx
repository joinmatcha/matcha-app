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

import { getJobById } from '@/api/job';
import BackgroundRadial from '@/components/Background/BackgroundRadial';
import { InfoRow } from '@/components/Job/InfoRow';
import { SoftCard } from '@/components/Job/SoftCard';
import { ProfileSection, TagList } from '@/components/Personality';
import Colors from '@/themes/colors';
import { HomeStackParamList } from '@/types/navigation';

type Route = RouteProp<HomeStackParamList, 'JobDetail'>;
type Nav = NativeStackNavigationProp<HomeStackParamList>;

export default function JobDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { jobId } = params;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getJobById(jobId);
        if (mounted) setJob(res.job);
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

  return (
    <BackgroundRadial>
      <SafeAreaView style={styles.safeArea} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.title}>{job.title}</Text>

          <View style={styles.metaRow}>
            {job.sector ? (
              <View style={styles.sectorBadge}>
                <Text style={styles.sectorText}>{job.sector}</Text>
              </View>
            ) : null}

            {job.growthOutlook ? (
              <View style={styles.outlookBadge}>
                <View style={styles.dot} />
                <Text style={styles.outlookText}>
                  {job.growthOutlook === 'growing' &&
                    'Bon niveau d’opportunités'}
                  {job.growthOutlook === 'stable' && 'Marché plutôt stable'}
                  {job.growthOutlook === 'declining' &&
                    'Opportunités plus ciblées'}
                  {job.growthOutlook === 'unknown' && 'Marché variable'}
                </Text>
              </View>
            ) : null}
          </View>

          {job.growthOutlook ? (
            <Text style={styles.marketText}>
              {job.growthOutlook === 'growing' &&
                'Le marché recrute régulièrement : de nouvelles offres apparaissent souvent.'}
              {job.growthOutlook === 'stable' &&
                'Les besoins sont constants : les postes existent mais évoluent moins vite.'}
              {job.growthOutlook === 'declining' &&
                'Le métier reste présent mais sur des périmètres plus spécialisés.'}
              {job.growthOutlook === 'unknown' &&
                'Les opportunités dépendent beaucoup du secteur et de la région.'}
            </Text>
          ) : null}
        </View>

        {/* RÉSUMÉ */}
        {job.description ? (
          <SoftCard>
            <Text style={styles.resumeTitle}>En résumé</Text>
            <Text style={styles.resumeText}>{job.description}</Text>
          </SoftCard>
        ) : null}

        {/* MISSIONS */}
        {job.missions?.length ? (
          <ProfileSection title="Missions principales">
            <View style={styles.rowsGap}>
              {job.missions.map((m: string, i: number) => (
                <InfoRow key={i} label={m} />
              ))}
            </View>
          </ProfileSection>
        ) : null}

        {/* QUOTIDIEN */}
        {job.dailyTasks?.length ? (
          <ProfileSection title="Au quotidien">
            <View style={styles.rowWrap}>
              {job.dailyTasks.map((t: string, i: number) => (
                <View key={i} style={styles.activityTag}>
                  <Text style={styles.activityText}>{t}</Text>
                </View>
              ))}
            </View>
          </ProfileSection>
        ) : null}

        {/* PROFIL RECHERCHÉ */}
        <ProfileSection title="Profil recherché">
          {job.competences?.length ? (
            <>
              <Text style={styles.subLabel}>Compétences clés</Text>
              <TagList items={job.competences} />
            </>
          ) : null}

          {job.softSkills?.length ? (
            <>
              <Text style={styles.subLabel}>Soft skills</Text>
              <TagList items={job.softSkills} />
            </>
          ) : null}

          {job.values?.length ? (
            <>
              <Text style={styles.subLabel}>Valeurs associées</Text>
              <TagList items={job.values} />
            </>
          ) : null}

          {job.workConditions?.length ? (
            <>
              <Text style={styles.subLabel}>Conditions de travail</Text>
              <TagList items={job.workConditions} />
            </>
          ) : null}
        </ProfileSection>

        {/* ÉVOLUTIONS */}
        {job.evolutionPaths?.length ? (
          <ProfileSection title="Évolutions possibles">
            <View style={styles.evolutionContainer}>
              {job.evolutionPaths.map((e: string, i: number) => (
                <View key={i} style={styles.evolutionStep}>
                  <Text style={styles.evolutionText}>{e}</Text>
                </View>
              ))}
            </View>
          </ProfileSection>
        ) : null}

        {/* SALAIRE */}
        {job.salaryMin || job.salaryMax ? (
          <ProfileSection title="Rémunération (indicatif)">
            <View style={styles.salaryCard}>
              <Text style={styles.salaryText}>
                {job.salaryMin && job.salaryMax
                  ? `Entre ${job.salaryMin}€ et ${job.salaryMax}€ brut / an`
                  : job.salaryMin
                    ? `À partir de ${job.salaryMin}€ brut / an`
                    : `Jusqu’à ${job.salaryMax}€ brut / an`}
              </Text>
            </View>
          </ProfileSection>
        ) : null}

        {/* ACTIONS */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.backToBilanButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.backToBilanText}>Retour au bilan</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 34 }} />
      </ScrollView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'transparent' },
  container: { paddingBottom: 24 },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  errorText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.75)',
    marginBottom: 12,
  },

  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.greyDark.normal,
  },

  hero: {
    marginHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.greyDark.normal,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },

  sectorBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,167,38,0.16)',
  },

  sectorText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.orange.normal,
  },

  outlookBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(46,125,50,0.10)',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: Colors.greenDark.normal,
  },

  outlookText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.greenDark.normal,
  },

  marketText: {
    marginTop: 10,
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 18,
  },

  resumeTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    color: Colors.greyDark.normal,
  },

  resumeText: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(0,0,0,0.75)',
  },

  subLabel: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.6)',
  },

  rowsGap: {
    gap: 10,
  },

  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  activityTag: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  activityText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.75)',
  },

  evolutionContainer: {
    gap: 10,
  },

  evolutionStep: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(46,125,50,0.08)',
  },

  evolutionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.greenDark.normal,
  },

  salaryCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(76,175,80,0.12)',
    alignItems: 'center',
  },

  salaryText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.greenDark.normal,
    textAlign: 'center',
  },

  bottomActions: {
    marginTop: 18,
    marginHorizontal: 16,
  },

  backToBilanButton: {
    backgroundColor: Colors.greenDark.normal,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  backToBilanText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
});
