import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/Background/BackgroundRadial';
import {
  ProfileHeader,
  ProfileSection,
  TagList,
} from '@/components/Personality';
import Colors from '@/themes/colors';
import { HomeStackParamList } from '@/types/navigation';

type ResultRoute = RouteProp<HomeStackParamList, 'BilanResult'>;
type ResultNav = NativeStackNavigationProp<HomeStackParamList, 'BilanResult'>;

export default function BilanResultScreen() {
  const route = useRoute<ResultRoute>();
  const navigation = useNavigation<ResultNav>();

  const { bilan } = route.params;
  const { conclusion, investigation } = bilan;

  return (
    <BackgroundRadial>
      <SafeAreaView style={styles.safeArea} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Ton profil professionnel</Text>
          <Text style={styles.heroSubtitle}>
            Ce bilan met en lumière ce qui te motive, ce que tu sais bien faire
            et les environnements dans lesquels tu peux vraiment t’épanouir.
          </Text>
        </View>

        <ProfileHeader label={conclusion.archetype.title} showLogo={false} />

        <View style={styles.archetypeIntro}>
          <Text style={styles.archetypeSubtitle}>
            {conclusion.archetype.subtitle}
          </Text>

          <Text style={styles.archetypeDescription}>
            {conclusion.archetype.description}
          </Text>
        </View>

        {/* FORCES */}
        <ProfileSection title="Tes forces dominantes">
          <TagList items={conclusion.keyStrengths} variant="success" />
        </ProfileSection>

        {/* VALEURS & CONDITIONS */}
        <ProfileSection title="Ce qui est important pour toi">
          <Text style={styles.sectionLabel}>Valeurs clés</Text>
          <TagList items={investigation.topValues} />

          <View style={{ height: 14 }} />

          <Text style={styles.sectionLabel}>Conditions de travail idéales</Text>
          <TagList items={investigation.topWorkConditions} />
        </ProfileSection>

        {/* AXES DE PROGRESSION */}
        <ProfileSection title="Pistes de développement">
          <Text style={styles.helperText}>
            Des compétences à renforcer pour continuer à progresser sereinement.
          </Text>
          <TagList items={conclusion.improvementAxes} variant="warning" />
        </ProfileSection>

        {/* ENVIRONNEMENTS */}
        <ProfileSection title="Environnements où tu peux t’épanouir">
          {conclusion.recommendedEnvironments.map((env, idx) => (
            <View key={idx} style={styles.envCard}>
              <Text style={styles.envTitle}>{env}</Text>

              <Text style={styles.envText}>
                Tu es particulièrement à l’aise dans des contextes où la
                relation humaine, l’écoute et l’accompagnement jouent un rôle
                central.
              </Text>

              <View style={styles.envTags}>
                <Text style={styles.envTag}>Accompagnement</Text>
                <Text style={styles.envTag}>Transmission</Text>
                <Text style={styles.envTag}>Impact humain</Text>
              </View>
            </View>
          ))}
        </ProfileSection>

        {/* MÉTIERS */}
        <ProfileSection title="Pistes métiers à explorer">
          {conclusion.recommendedJobs.slice(0, 8).map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                {job.sector && (
                  <Text style={styles.jobSector}>{job.sector}</Text>
                )}
              </View>

              {job.description && (
                <Text style={styles.jobDescription}>{job.description}</Text>
              )}

              <View style={styles.jobFooter}>
                <Text style={styles.jobScore}>Affinité {job.score}</Text>

                <TouchableOpacity
                  onPress={() => {
                    // plus tard : navigation.navigate('JobDetail', { jobId: job.id })
                  }}
                >
                  <Text style={styles.jobLink}>Explorer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ProfileSection>

        {/* PLAN D’ACTION */}
        <ProfileSection title="Prochaines étapes" isLast>
          {conclusion.actionPlan.slice(0, 3).map((step, idx) => (
            <Text key={idx} style={styles.bulletText}>
              {idx + 1}. {step}
            </Text>
          ))}
        </ProfileSection>

        {/* ACTIONS */}
        <TouchableOpacity
          style={styles.redoButton}
          onPress={() => navigation.navigate('BilanIntro')}
        >
          <Text style={styles.redoButtonText}>Refaire le bilan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('HomeMain')}
        >
          <Text style={styles.backButtonText}>Retour à l’accueil</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'transparent' },
  container: { paddingBottom: 32 },

  hero: {
    marginHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.greyDark.normal,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 20,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.6)',
    marginBottom: 6,
  },

  helperText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.65)',
    marginBottom: 8,
  },

  archetypeIntro: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 20,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  archetypeSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.greyDark.normal,
    textAlign: 'center',
    marginBottom: 8,
  },

  archetypeDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(0,0,0,0.7)',
    textAlign: 'center',
  },

  /* ENVIRONNEMENTS */
  envCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  envTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.greyDark.normal,
  },
  envText: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 18,
  },
  envTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  envTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(46,125,50,0.1)',
    fontSize: 12,
    color: Colors.greenDark.normal,
  },

  /* JOB CARDS */
  jobCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.greyDark.normal,
  },

  jobSector: {
    fontSize: 12,
    color: Colors.orange.normal,
    fontWeight: '600',
  },

  jobDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0,0,0,0.7)',
    marginBottom: 10,
  },

  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  jobScore: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },

  jobLink: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.greenDark.normal,
  },

  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.greyDark.normal,
    marginBottom: 6,
  },

  redoButton: {
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.greenDark.normal,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  redoButtonText: {
    color: Colors.greenDark.normal,
    fontSize: 15,
    fontWeight: '600',
  },

  backButton: {
    marginHorizontal: 16,
    backgroundColor: Colors.greenDark.normal,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
