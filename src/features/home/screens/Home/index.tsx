import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import MatchaButton from '@/components/ui/MatchaButton';
import { useBilan } from '@/features/bilan/hooks/useBilan';
import { useMatchaProfile } from '@/features/home/hooks/useMatchaProfile';
import { useProfile } from '@/features/profile/hooks/useProfile';
import {
  Preferences,
  getPreferences,
} from '@/features/swipe/api/preferencesApi';
import { useWorkStyle } from '@/features/workStyle';
import { useAuth } from '@/hooks/useAuth';
import { clearDraft, loadDraft } from '@/services/draftStorage';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  labelFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { primaryButton } from '@/themes/ui';
import { RootStackParamList, TabParamList } from '@/types/navigation';

type BilanDraftData = {
  answers: [string, number | string][];
};

type HomeNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;
type IconName = keyof typeof MaterialIcons.glyphMap;
type FeatureTone = 'lavender' | 'mint' | 'stone' | 'locked';

type FeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  icon: IconName;
  tone: FeatureTone;
  onPress: () => void;
  accent?: string;
  disabled?: boolean;
};

const HOME_ACCENT = '#00513A';
const INK = '#101820';
const MUTED = '#5A626D';

const toneStyles: Record<
  FeatureTone,
  { card: StyleProp<ViewStyle>; icon: StyleProp<ViewStyle>; iconColor: string }
> = {
  lavender: {
    card: { backgroundColor: '#E8CBEA' },
    icon: { borderColor: '#A564AC' },
    iconColor: '#7D3F84',
  },
  mint: {
    card: { backgroundColor: '#DDEDE4' },
    icon: { borderColor: HOME_ACCENT },
    iconColor: HOME_ACCENT,
  },
  stone: {
    card: { backgroundColor: '#F0EDE6' },
    icon: { borderColor: '#82918B' },
    iconColor: '#39443F',
  },
  locked: {
    card: { backgroundColor: '#ECE9E2' },
    icon: { borderColor: '#9EA7A2' },
    iconColor: '#6E7772',
  },
};

function getFirstName(user?: { firstName?: string | null } | null) {
  return user?.firstName?.trim() || 'toi';
}

function joinSignals(values?: string[], fallback = 'Ton profil se précise.') {
  const clean = values?.filter(Boolean).slice(0, 2) ?? [];
  return clean.length > 0 ? clean.join(' · ') : fallback;
}

function FeatureCard({
  eyebrow,
  title,
  description,
  buttonLabel,
  icon,
  tone,
  onPress,
  accent,
  disabled = false,
}: FeatureCardProps) {
  const style = toneStyles[tone];

  return (
    <View
      style={[
        styles.featureCard,
        style.card,
        disabled && styles.featureCardDisabled,
      ]}
    >
      <View style={styles.featureCopy}>
        <Text
          style={[
            styles.featureEyebrow,
            accent ? { color: accent } : null,
            disabled && styles.featureEyebrowDisabled,
          ]}
        >
          {eyebrow}
        </Text>
        <Text
          style={[styles.featureTitle, disabled && styles.featureTitleDisabled]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.featureDescription,
            disabled && styles.featureDescriptionDisabled,
          ]}
          numberOfLines={3}
        >
          {description}
        </Text>
        <MatchaButton
          label={buttonLabel}
          onPress={onPress}
          disabled={disabled}
        />
      </View>

      <View style={[styles.featureIcon, style.icon]}>
        <MaterialIcons name={icon} size={42} color={style.iconColor} />
      </View>
    </View>
  );
}

function ProgressRing({ completion }: { completion: number }) {
  const size = 72;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(completion, 100));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.progressRing}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#DDEDE4"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={HOME_ACCENT}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          fill="transparent"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={styles.progressValue}>{progress}%</Text>
    </View>
  );
}

function ProfileSnapshot({
  completion,
  onPress,
}: {
  completion: number;
  onPress: () => void;
}) {
  const isComplete = completion >= 100;

  return (
    <View style={styles.profileCard}>
      <View style={styles.profileCopy}>
        <Text style={styles.profileTitle}>Ton profil Matcha</Text>
        <Text style={styles.profileText}>
          Tes résultats, tes signaux et tes métiers cohérents au même endroit.
        </Text>
        <MatchaButton
          label={
            isComplete ? 'Voir mon profil Matcha' : 'Construire mon profil'
          }
          onPress={onPress}
          variant="primary"
        />
      </View>

      <ProgressRing completion={completion} />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function CareerSignalsCard({
  preferences,
  onOpenPreferences,
  onSwipePress,
}: {
  preferences: Preferences | null;
  onOpenPreferences: () => void;
  onSwipePress: () => void;
}) {
  const hasLikes = (preferences?.totalLikes ?? 0) > 0;

  return (
    <View style={styles.careerCard}>
      <Text style={styles.cardEyebrow}>Métiers favoris</Text>
      <Text style={styles.careerTitle}>
        {hasLikes
          ? `${preferences?.totalLikes} métiers aimés`
          : 'Construis ton top métiers'}
      </Text>
      <Text style={styles.careerDescription}>
        {hasLikes
          ? 'Retrouve ton classement, tes secteurs favoris et les fiches métier associées.'
          : 'Swipe quelques métiers pour faire ressortir tes favoris.'}
      </Text>

      <MatchaButton
        label={hasLikes ? 'Voir mes favoris' : 'Découvrir des métiers'}
        onPress={hasLikes ? onOpenPreferences : onSwipePress}
        variant="primary"
      />
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const { user: authUser, logout } = useAuth();
  const userId = authUser?.id;
  const { user, loading, error, refresh } = useProfile();
  const {
    bilan,
    loading: bilanLoading,
    error: bilanError,
    refreshBilan,
  } = useBilan();
  const {
    latestResult: workStyle,
    loading: workStyleLoading,
    refreshWorkStyle,
  } = useWorkStyle();
  const {
    profile: matchaProfile,
    loading: matchaProfileLoading,
    refresh: refreshMatchaProfile,
  } = useMatchaProfile();
  const [hasPersonalityDraft, setHasPersonalityDraft] = useState(false);
  const [hasBilanDraft, setHasBilanDraft] = useState(false);
  const [hasStartedBilanDraft, setHasStartedBilanDraft] = useState(false);
  const [bilanDraftUpdatedAt, setBilanDraftUpdatedAt] = useState<number | null>(
    null,
  );
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshBilan();
      refreshWorkStyle();
      refreshMatchaProfile();

      let isActive = true;

      const checkDraft = async () => {
        if (!userId) {
          if (!isActive) return;
          setHasPersonalityDraft(false);
          setHasBilanDraft(false);
          setHasStartedBilanDraft(false);
          setBilanDraftUpdatedAt(null);
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

        if (!isActive) return;

        setHasPersonalityDraft(!!personalityDraft);
        setHasBilanDraft(!!bilanDraft && !draftIsStale);
        setHasStartedBilanDraft(
          !!bilanDraft && !draftIsStale && !!bilanDraft.data.answers.length,
        );
        setBilanDraftUpdatedAt(
          !!bilanDraft && !draftIsStale ? bilanDraft.updatedAt : null,
        );
      };

      checkDraft().catch(() => {
        if (!isActive) return;
        setHasPersonalityDraft(false);
        setHasBilanDraft(false);
        setHasStartedBilanDraft(false);
        setBilanDraftUpdatedAt(null);
      });

      getPreferences()
        .then((data) => {
          if (isActive) setPreferences(data);
        })
        .catch(() => {
          if (isActive) setPreferences(null);
        });

      return () => {
        isActive = false;
      };
    }, [
      refresh,
      refreshBilan,
      refreshWorkStyle,
      refreshMatchaProfile,
      userId,
      bilan?.createdAt,
    ]),
  );

  if (loading || bilanLoading || workStyleLoading || matchaProfileLoading) {
    return (
      <BackgroundRadial bubbles>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.accent.primary} />
          </View>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

  if (error) {
    return (
      <BackgroundRadial bubbles>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <Button mode="contained" onPress={logout} style={primaryButton}>
              Se déconnecter
            </Button>
          </View>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

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
  const hasPersonality = Boolean(user?.personality);
  const hasWorkStyle = Boolean(workStyle);
  const completion =
    matchaProfile?.completion ??
    Math.round(
      ([hasBilan, hasPersonality, hasWorkStyle].filter(Boolean).length / 3) *
        100,
    );
  const firstName = getFirstName(user);

  const personalityTitle = hasPersonality
    ? (user?.personality?.label ?? 'Ton profil personnalité')
    : hasPersonalityDraft
      ? 'Test en cours'
      : 'Mieux te connaître';
  const personalityDescription = hasPersonality
    ? joinSignals(user?.personality?.strengths, user?.personality?.type)
    : hasPersonalityDraft
      ? 'Tu peux reprendre là où tu t’es arrêté.'
      : 'Comprends ton énergie, tes préférences et tes environnements naturels.';

  const bilanTitle = hasBilan
    ? (bilan?.conclusion?.archetype?.title ?? 'Ta synthèse professionnelle')
    : shouldUseBilanDraft && hasStartedBilanDraft
      ? 'Auto-évaluation en cours'
      : 'Ton Évaluation';
  const bilanDescription = hasBilan
    ? joinSignals(
        bilan?.conclusion?.keyStrengths?.slice(0, 2),
        'Forces, valeurs et pistes métier réunies.',
      )
    : bilanError
      ? 'La synthèse est momentanément indisponible.'
      : 'Découvre tes forces, tes préférences et tes points forts.';

  const workStyleTitle =
    workStyle?.profile?.title ??
    (workStyle ? 'Ton style professionnel' : 'Ton style pro');
  const workStyleDescription = workStyle
    ? joinSignals(
        workStyle.topAxisLabels,
        'Tes environnements de travail les plus naturels.',
      )
    : 'Identifie le cadre de travail dans lequel tu avances le mieux.';

  return (
    <BackgroundRadial bubbles>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.greeting}>Hello {firstName} !</Text>
            <Text style={styles.heroSubtitle}>
              Prêt à découvrir ton prochain match ?
            </Text>
          </View>

          <SectionHeader title="Profil" />
          <ProfileSnapshot
            completion={completion}
            onPress={() => navigation.navigate('MatchaProfile')}
          />

          <SectionHeader title="Tests & analyses" />
          <View style={styles.featureStack}>
            <FeatureCard
              eyebrow="Ton Évaluation"
              title={bilanTitle}
              description={bilanDescription}
              buttonLabel={
                hasBilan
                  ? 'Voir ma synthèse'
                  : shouldUseBilanDraft && hasStartedBilanDraft
                    ? 'Reprendre'
                    : 'Commencer'
              }
              icon="psychology"
              tone="lavender"
              accent="#6E3A75"
              onPress={() =>
                hasBilan && bilan
                  ? navigation.navigate('BilanResult', { bilan })
                  : navigation.navigate('BilanIntro', {
                      mode: shouldUseBilanDraft
                        ? hasStartedBilanDraft
                          ? 'resume'
                          : 'restart'
                        : 'start',
                    })
              }
            />

            <FeatureCard
              eyebrow="Ta personnalité"
              title={personalityTitle}
              description={personalityDescription}
              buttonLabel={
                hasPersonality
                  ? 'Voir le résultat'
                  : hasPersonalityDraft
                    ? 'Reprendre'
                    : 'Commencer'
              }
              icon="favorite-border"
              tone="mint"
              onPress={() =>
                hasPersonality && user?.personality
                  ? navigation.navigate('PersonalityResult', {
                      result: user.personality,
                    })
                  : navigation.navigate('PersonalityIntro', {
                      hasDraft: hasPersonalityDraft,
                    })
              }
            />

            <FeatureCard
              eyebrow="Style professionnel"
              title={workStyleTitle}
              description={workStyleDescription}
              buttonLabel={workStyle ? 'Voir mon style' : 'Découvrir'}
              icon="tune"
              tone="stone"
              onPress={() =>
                workStyle
                  ? navigation.navigate('WorkStyleResult', {
                      result: workStyle,
                    })
                  : navigation.navigate('WorkStyleIntro')
              }
            />
          </View>

          <SectionHeader title="Métiers" />
          <CareerSignalsCard
            preferences={preferences}
            onOpenPreferences={() => navigation.navigate('CareerPreferences')}
            onSwipePress={() => navigation.navigate('Swipe')}
          />

          <SectionHeader title="À venir" />
          <FeatureCard
            eyebrow="Ton aventure"
            title="Passe à l’action"
            description="Transforme bientôt tes résultats en plan d’action concret, étape par étape."
            buttonLabel="Bientôt disponible"
            icon="flag"
            tone="locked"
            disabled
            onPress={() => undefined}
          />
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    marginBottom: 18,
    textAlign: 'center',
    color: '#B00020',
    fontFamily: bodyFontFamily,
  },
  hero: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: titleFontFamily,
    color: INK,
  },
  heroSubtitle: {
    marginTop: 6,
    maxWidth: 260,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: bodyFontFamily,
    color: INK,
  },
  profileCard: {
    minHeight: 124,
    marginBottom: 16,
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#22332C',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  profileCopy: {
    flex: 1,
    paddingRight: 14,
  },
  profileTitle: {
    fontSize: 25,
    lineHeight: 30,
    fontFamily: titleFontFamily,
    color: INK,
  },
  profileText: {
    marginTop: 8,
    marginBottom: 12,
    maxWidth: 220,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: INK,
  },
  progressRing: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    position: 'absolute',
    fontSize: 18,
    fontFamily: titleFontFamily,
    color: INK,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 18,
    lineHeight: 23,
    fontFamily: titleFontFamily,
    color: INK,
  },
  featureStack: {
    gap: 14,
    marginBottom: 18,
  },
  featureCard: {
    minHeight: 146,
    borderRadius: 8,
    padding: 18,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  featureCardDisabled: {
    opacity: 0.86,
  },
  featureCopy: {
    flex: 1,
    paddingRight: 12,
  },
  featureEyebrow: {
    marginBottom: 6,
    fontSize: 12,
    lineHeight: 15,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  featureEyebrowDisabled: {
    color: '#6E7772',
  },
  featureTitle: {
    fontSize: 25,
    lineHeight: 29,
    fontFamily: titleFontFamily,
    color: INK,
  },
  featureTitleDisabled: {
    color: '#26312C',
  },
  featureDescription: {
    marginTop: 8,
    marginBottom: 13,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: INK,
  },
  featureDescriptionDisabled: {
    color: '#5F6863',
  },
  featureIcon: {
    alignSelf: 'flex-end',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.38)',
  },
  careerCard: {
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 81, 58, 0.12)',
    backgroundColor: 'rgba(255,255,255,0.94)',
    shadowColor: '#22332C',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardEyebrow: {
    marginBottom: 4,
    fontSize: 13,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  careerTitle: {
    fontSize: 25,
    lineHeight: 30,
    fontFamily: titleFontFamily,
    color: INK,
  },
  careerDescription: {
    marginTop: 8,
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: MUTED,
  },
});
