import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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

import AppScreen from '@/components/layout/AppScreen';
import PersonalityProfileHeader from '@/features/personality/components/PersonalityProfileHeader';
import ProfileSection from '@/features/personality/components/ProfileSection';
import { useAuth } from '@/hooks/useAuth';
import { clearDraft, saveDraft } from '@/services/draftStorage';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
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

type ResultRoute = RouteProp<RootStackParamList, 'BilanResult'>;
type ResultNav = NativeStackNavigationProp<RootStackParamList, 'BilanResult'>;
type BilanDraftData = {
  answers: [string, number | string][];
};

export default function BilanResultScreen() {
  const route = useRoute<ResultRoute>();
  const navigation = useNavigation<ResultNav>();
  const { user } = useAuth();

  const { bilan } = route.params;
  const { conclusion, investigation } = bilan;
  const handleRedo = async () => {
    if (user?.id) {
      await clearDraft('bilan', user.id);
      await saveDraft<BilanDraftData>({
        userId: user.id,
        module: 'bilan',
        schemaVersion: 1,
        templateVersion: String(bilan.version),
        updatedAt: Date.now(),
        data: { answers: [] },
      });
    }

    navigation.navigate('BilanIntro', { mode: 'restart' });
  };

  return (
    <AppScreen>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>AUTO-ÉVALUATION TERMINÉE</Text>
          <Text style={styles.heroTitle}>Ton profil professionnel</Text>
          <Text style={styles.heroSubtitle}>
            Cette synthèse met en lumière ce qui te motive, ce que tu sais bien
            faire et les environnements dans lesquels tu peux vraiment
            t’épanouir.
          </Text>
        </View>

        <PersonalityProfileHeader
          label={conclusion.archetype.title}
          type={conclusion.archetype.subtitle}
          showLogo={false}
        />

        <View style={styles.overviewRow}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>
              {conclusion.keyStrengths.length}
            </Text>
            <Text style={styles.overviewLabel}>forces clés</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>
              {investigation.topValues.length}
            </Text>
            <Text style={styles.overviewLabel}>valeurs fortes</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewValue}>
              {conclusion.recommendedSectors.length}
            </Text>
            <Text style={styles.overviewLabel}>secteurs à explorer</Text>
          </View>
        </View>

        <ProfileSection title="Tes forces dominantes">
          <Text style={styles.sectionIntro}>
            Les points sur lesquels tu peux t'appuyer en priorité.
          </Text>
          <View style={styles.gridList}>
            {conclusion.keyStrengths.map((item) => (
              <View key={item} style={styles.gridItem}>
                <View style={styles.gridIcon}>
                  <View style={styles.gridIconDot} />
                </View>
                <Text style={styles.gridItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </ProfileSection>

        <ProfileSection title="Ce qui est important pour toi">
          <Text style={styles.sectionLabel}>Valeurs clés</Text>
          <View style={styles.inlineList}>
            {investigation.topValues.map((item) => (
              <View key={item} style={styles.inlineItem}>
                <Text style={styles.inlineItemText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.spacerSm} />

          <Text style={styles.sectionLabel}>Conditions de travail idéales</Text>
          <View style={styles.conditionList}>
            {investigation.topWorkConditions.map((item) => (
              <View key={item} style={styles.conditionRow}>
                <View style={styles.conditionMarker} />
                <Text style={styles.conditionText}>{item}</Text>
              </View>
            ))}
          </View>
        </ProfileSection>

        <ProfileSection title="Pistes de développement">
          <Text style={styles.helperText}>
            Des compétences à renforcer pour continuer à progresser sereinement.
          </Text>
          <View style={styles.improvementList}>
            {conclusion.improvementAxes.map((item) => (
              <View key={item} style={styles.improvementRow}>
                <View style={styles.improvementPill}>
                  <Text style={styles.improvementPillText}>À travailler</Text>
                </View>
                <Text style={styles.improvementText}>{item}</Text>
              </View>
            ))}
          </View>
        </ProfileSection>

        <ProfileSection title="Secteurs et environnements à explorer">
          {conclusion.recommendedSectors.map((env, idx) => (
            <View key={idx} style={styles.envCard}>
              <View style={styles.envTitleRow}>
                <View style={styles.envAccent} />
                <Text style={styles.envTitle}>{env}</Text>
              </View>

              <Text style={styles.envText}>
                Ce secteur ressort comme une zone à explorer. Il sera croisé
                avec tes autres résultats et tes likes pour préciser les métiers
                qui méritent vraiment ton attention.
              </Text>

              <View style={styles.envTags}>
                <Text style={styles.envTag}>Signal du bilan</Text>
                <Text style={styles.envTag}>À croiser</Text>
                <Text style={styles.envTag}>À vérifier</Text>
              </View>
            </View>
          ))}
        </ProfileSection>

        <ProfileSection title="Prochaines étapes" isLast>
          {conclusion.actionPlan.slice(0, 3).map((step, idx) => (
            <View key={idx} style={styles.actionRow}>
              <View style={styles.actionIndex}>
                <Text style={styles.actionIndexText}>{idx + 1}</Text>
              </View>
              <Text style={styles.bulletText}>{step}</Text>
            </View>
          ))}
        </ProfileSection>

        <TouchableOpacity style={styles.redoButton} onPress={handleRedo}>
          <Text style={styles.redoButtonText}>Refaire l'auto-évaluation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Main', params: { screen: 'Home' } }],
              }),
            )
          }
        >
          <Text style={styles.backButtonText}>Retour à l’accueil</Text>
        </TouchableOpacity>

        <View style={styles.spacerLg} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'transparent' },
  container: { paddingHorizontal: 24, paddingBottom: 32 },

  hero: {
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
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  overviewCard: {
    ...cardSurface,
    borderRadius: 8,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: titleFontFamily,
    fontWeight: '700',
    color: Colors.greenDark.normal,
  },
  overviewLabel: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 6,
  },
  spacerSm: {
    height: 14,
  },
  spacerLg: {
    height: 40,
  },
  reasonsContainer: {
    marginBottom: 10,
    gap: 8,
  },

  helperText: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
    marginBottom: 8,
  },
  sectionIntro: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
    marginBottom: 10,
  },

  gridList: {
    gap: 10,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FBF9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  gridIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E9F2ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.greenDark.normal,
  },
  gridItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.strong,
  },
  inlineList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inlineItem: {
    ...softBadge,
    backgroundColor: '#F5F1EC',
  },
  inlineItemText: {
    ...softBadgeText,
    fontFamily: titleFontFamily,
    color: '#5F5A56',
  },
  conditionList: {
    gap: 10,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  conditionMarker: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.greenDark.normal,
  },
  conditionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.strong,
  },
  improvementList: {
    gap: 12,
  },
  improvementRow: {
    backgroundColor: '#FFF6EF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  improvementPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1ECE7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
  },
  improvementPillText: {
    fontSize: 11,
    fontFamily: titleFontFamily,
    fontWeight: '600',
    color: '#6B605A',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  improvementText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.strong,
  },

  envCard: {
    ...cardSurface,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#F8FBF9',
  },
  envTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  envAccent: {
    width: 4,
    height: 18,
    borderRadius: 999,
    backgroundColor: Colors.greenDark.normal,
  },
  envTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  envText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  envTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  envTag: {
    ...softBadge,
    backgroundColor: '#ECF3EF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 12,
    fontFamily: titleFontFamily,
    color: '#456457',
  },

  jobCard: {
    ...cardSurface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  jobHeader: {
    marginBottom: 6,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: '#232220',
  },

  jobSector: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: 6,
    fontSize: 12,
    fontFamily: titleFontFamily,
    color: Colors.greenDark.normal,
    fontWeight: '600',
    textAlign: 'left',
  },

  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.greenDark.normal,
    marginTop: 5,
  },

  jobLink: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  jobLinkButton: {
    ...secondaryButton,
    minHeight: 44,
    marginTop: 2,
  },
  compareModeButtonText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.text.muted,
  },
  selectionRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: '#F8FBF9',
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 10,
  },
  selectionCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.greenDark.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionCircleActive: {
    backgroundColor: Colors.greenDark.normal,
  },
  selectionCircleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  selectionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.greenDark.normal,
  },
  compareButton: {
    ...primaryButton,
    minHeight: 46,
    marginTop: 2,
  },
  compareButtonDisabled: {
    backgroundColor: Colors.ui.surfaceMuted,
    shadowOpacity: 0,
  },
  compareButtonText: {
    ...primaryButtonText,
    fontSize: 15,
  },
  compareButtonTextDisabled: {
    color: Colors.text.muted,
  },

  jobReason: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: 'rgba(0,0,0,0.82)',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  actionIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EAF4EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  actionIndexText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: '#232220',
  },

  primaryCta: {
    ...primaryButton,
    marginTop: 16,
  },
  primaryCtaText: {
    ...primaryButtonText,
    fontFamily: titleFontFamily,
  },

  redoButton: {
    ...secondaryButton,
    marginTop: 24,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  redoButtonText: {
    ...secondaryButtonText,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: titleFontFamily,
  },

  backButton: {
    ...primaryButton,
    marginHorizontal: 16,
  },
  backButtonText: {
    ...primaryButtonText,
    fontFamily: titleFontFamily,
  },
});
