import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
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
  JobMatchingJob,
  JobMatchingResponse,
  decideJobMatching,
  getJobMatching,
  resetJobMatching,
} from '@/features/jobs/api/jobMatchingApi';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  labelFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { RootStackParamList } from '@/types/navigation';
import { getApiErrorMessage } from '@/utils/apiError';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const SWIPE_THRESHOLD = 120;

function JobListItem({
  job,
  onPress,
}: {
  job: JobMatchingJob;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.likedRow} onPress={onPress}>
      <View style={styles.likedCopy}>
        <Text style={styles.likedTitle}>{job.title}</Text>
        <Text style={styles.likedMeta}>
          {job.sector ?? 'Secteur non précisé'} · {job.score}% de cohérence
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={Colors.text.muted} />
    </TouchableOpacity>
  );
}

export default function JobMatchingScreen() {
  const navigation = useNavigation<Nav>();
  const [matching, setMatching] = useState<JobMatchingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMatching(await getJobMatching());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossible de charger le matching.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const currentJob = useMemo(
    () => matching?.jobs.find((job) => !job.decision) ?? null,
    [matching],
  );
  const nextJobs = useMemo(
    () => matching?.jobs.filter((job) => !job.decision).slice(1, 3) ?? [],
    [matching],
  );
  const pan = useRef(new Animated.ValueXY()).current;
  const isAnimating = useRef(false);
  const currentJobRef = useRef<JobMatchingJob | null>(null);
  currentJobRef.current = currentJob;

  useEffect(() => {
    pan.x.setValue(0);
    isAnimating.current = false;
  }, [currentJob?.id, pan.x]);

  const decidedCount = matching ? matching.total - matching.remaining : 0;
  const progress = matching?.total ? decidedCount / matching.total : 0;

  const decide = async (action: 'like' | 'dislike') => {
    if (!currentJob || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      setMatching(await decideJobMatching(currentJob.id, action));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossible d’enregistrer ton choix.'));
    } finally {
      setSubmitting(false);
    }
  };

  const animateDecision = (action: 'like' | 'dislike') => {
    if (isAnimating.current || submitting || !currentJobRef.current) return;

    isAnimating.current = true;
    Animated.timing(pan.x, {
      toValue: action === 'like' ? 520 : -520,
      duration: 240,
      useNativeDriver: false,
    }).start(() => {
      decide(action);
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isAnimating.current,
    onMoveShouldSetPanResponder: (_, gesture) =>
      !isAnimating.current &&
      Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
      Math.abs(gesture.dx) > 5,
    onPanResponderGrant: () => {
      pan.x.setValue(0);
    },
    onPanResponderMove: (_, gesture) => {
      if (!isAnimating.current) pan.x.setValue(gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        animateDecision('like');
        return;
      }
      if (gesture.dx < -SWIPE_THRESHOLD) {
        animateDecision('dislike');
        return;
      }
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
    onPanResponderTerminationRequest: () => false,
  });

  const cardRotation = pan.x.interpolate({
    inputRange: [-220, 0, 220],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });
  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const restart = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      setMatching(await resetJobMatching());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossible de recommencer.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppScreen>
        <SafeAreaView edges={['left', 'right']} style={styles.center}>
          <ActivityIndicator color={Colors.accent.primary} size="large" />
        </SafeAreaView>
      </AppScreen>
    );
  }

  if (!matching || error) {
    return (
      <AppScreen>
        <SafeAreaView edges={['left', 'right']} style={styles.center}>
          <Text style={styles.emptyTitle}>Matching indisponible</Text>
          <Text style={styles.emptyText}>
            {error ?? 'Impossible de charger tes métiers matchés.'}
          </Text>
          <MatchaButton label="Réessayer" onPress={load} />
        </SafeAreaView>
      </AppScreen>
    );
  }

  if (!matching.unlocked) {
    return (
      <AppScreen>
        <SafeAreaView edges={['left', 'right']} style={styles.center}>
          <Text style={styles.emptyTitle}>Matching verrouillé</Text>
          <Text style={styles.emptyText}>
            Termine les 3 tests pour débloquer les métiers les plus cohérents
            avec ton profil.
          </Text>
          <MatchaButton
            label="Retour au profil"
            onPress={() => navigation.navigate('MatchaProfile')}
          />
        </SafeAreaView>
      </AppScreen>
    );
  }

  if (matching.completed) {
    return (
      <AppScreen>
        <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>MATCHING MÉTIER</Text>
              <Text style={styles.title}>Tes métiers retenus</Text>
              <Text style={styles.subtitle}>
                Voici les métiers que tu as gardés parmi les {matching.total}{' '}
                propositions les plus proches de ton profil consolidé.
              </Text>
            </View>

            <View style={styles.card}>
              {matching.likedJobs.length ? (
                matching.likedJobs.map((job) => (
                  <JobListItem
                    key={job.id}
                    job={job}
                    onPress={() =>
                      navigation.navigate('JobDetail', { jobId: job.id })
                    }
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Tu n’as gardé aucun métier sur cette session.
                </Text>
              )}
            </View>

            <View style={styles.actions}>
              <MatchaButton
                label="Recommencer le matching"
                variant="primary"
                fullWidth
                onPress={restart}
                disabled={submitting}
              />
              <MatchaButton
                label="Retour au profil"
                fullWidth
                onPress={() => navigation.navigate('MatchaProfile')}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </AppScreen>
    );
  }

  return (
    <View style={styles.backgroundRoot}>
      <LinearGradient
        colors={['#F8F4EE', '#F5F1EA', '#F9F6EF']}
        style={styles.absoluteFill}
      />
      <View style={styles.backgroundWash} pointerEvents="none" />
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.matchRoot}>
        <View style={styles.matchHeader}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>MATCHING MÉTIER</Text>
            <Text style={styles.matchTitle}>Métiers les plus proches</Text>
            <Text style={styles.matchSubtitle}>
              Garde ou écarte les propositions issues de tes résultats croisés.
            </Text>
          </View>
          <View style={styles.remainingPill}>
            <Text style={styles.remainingValue}>{matching.remaining}</Text>
            <Text style={styles.remainingLabel}>restants</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {decidedCount}/{matching.total} métiers évalués
          </Text>
        </View>

        <View style={styles.cardArea}>
          {nextJobs[1] ? <View style={styles.cardShadowBackMost} /> : null}
          {nextJobs[0] ? <View style={styles.cardShadowBack} /> : null}

          {currentJob ? (
            <Animated.View
              style={[
                styles.swipeCard,
                {
                  transform: [{ translateX: pan.x }, { rotate: cardRotation }],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Animated.View
                style={[
                  styles.overlay,
                  styles.likeOverlay,
                  { opacity: likeOpacity },
                ]}
                pointerEvents="none"
              >
                <MaterialIcons name="favorite" size={24} color="#0F8A62" />
                <Text style={styles.likeOverlayText}>Je garde</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.overlay,
                  styles.nopeOverlay,
                  { opacity: nopeOpacity },
                ]}
                pointerEvents="none"
              >
                <MaterialIcons name="close" size={24} color="#B42348" />
                <Text style={styles.nopeOverlayText}>Je passe</Text>
              </Animated.View>

              <View style={styles.cardTop}>
                <View style={styles.sectorTag}>
                  <Text style={styles.sectorText} numberOfLines={1}>
                    {currentJob.sector ?? 'Secteur non précisé'}
                  </Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreValue}>{currentJob.score}%</Text>
                  <Text style={styles.scoreLabel}>match</Text>
                </View>
              </View>

              <View style={styles.heroPanel}>
                <Text style={styles.cardKicker}>Piste proposée</Text>
                <Text style={styles.cardTitle} numberOfLines={3}>
                  {currentJob.title}
                </Text>
              </View>

              <View style={styles.reasonsPanel}>
                {currentJob.reasons.slice(0, 2).map((reason) => (
                  <View key={reason} style={styles.reasonRow}>
                    <MaterialIcons
                      name="check-circle"
                      size={17}
                      color={Colors.accent.primary}
                    />
                    <Text style={styles.reasonText} numberOfLines={2}>
                      {reason}
                    </Text>
                  </View>
                ))}
              </View>

              <MatchaButton
                label="Voir la fiche"
                icon="arrow-forward"
                variant="primary"
                onPress={() =>
                  navigation.navigate('JobDetail', { jobId: currentJob.id })
                }
                style={styles.cardFooter}
              />
            </Animated.View>
          ) : null}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.dislikeRoundButton]}
            onPress={() => animateDecision('dislike')}
            disabled={submitting}
          >
            <MaterialIcons name="close" size={30} color="#B42348" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.likeRoundButton]}
            onPress={() => animateDecision('like')}
            disabled={submitting}
          >
            <MaterialIcons name="favorite" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundRoot: {
    flex: 1,
    backgroundColor: '#F6F3EE',
  },
  backgroundWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,81,58,0.035)',
  },
  matchRoot: {
    flex: 1,
  },
  safeArea: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 18,
  },
  hero: {
    gap: 8,
  },
  eyebrow: {
    fontFamily: labelFontFamily,
    fontSize: 12,
    letterSpacing: 0,
    color: Colors.accent.primary,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerCopy: {
    flex: 1,
  },
  matchTitle: {
    marginTop: 4,
    fontFamily: titleFontFamily,
    fontSize: 28,
    lineHeight: 33,
    color: Colors.text.strong,
  },
  matchSubtitle: {
    marginTop: 4,
    fontFamily: bodyFontFamily,
    fontSize: 15,
    lineHeight: 21,
    color: Colors.text.muted,
  },
  remainingPill: {
    minWidth: 72,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.14)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  remainingValue: {
    fontFamily: titleFontFamily,
    fontSize: 22,
    color: Colors.accent.primary,
  },
  remainingLabel: {
    fontFamily: bodyFontFamily,
    fontSize: 11,
    color: Colors.text.muted,
  },
  title: {
    fontFamily: titleFontFamily,
    fontSize: 30,
    color: Colors.text.strong,
  },
  subtitle: {
    fontFamily: bodyFontFamily,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text.muted,
  },
  progressCard: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 10,
  },
  progressTrack: {
    height: 8,
    borderRadius: 99,
    backgroundColor: '#E9E4D8',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent.primary,
  },
  progressText: {
    fontFamily: labelFontFamily,
    fontSize: 13,
    color: Colors.text.muted,
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  cardShadowBackMost: {
    position: 'absolute',
    width: '82%',
    height: 388,
    borderRadius: 8,
    backgroundColor: 'rgba(0,81,58,0.07)',
    transform: [{ translateX: -8 }, { translateY: 18 }, { rotate: '-2deg' }],
  },
  cardShadowBack: {
    position: 'absolute',
    width: '85%',
    height: 390,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.08)',
    transform: [{ translateX: 8 }, { translateY: 10 }, { rotate: '1.5deg' }],
  },
  swipeCard: {
    width: '90%',
    height: 400,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.10)',
    shadowColor: '#5C5148',
    shadowOpacity: 0.13,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 16 },
    elevation: 9,
  },
  overlay: {
    position: 'absolute',
    top: 66,
    alignSelf: 'center',
    minWidth: 172,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
  },
  likeOverlay: {
    backgroundColor: 'rgba(236,253,245,0.94)',
    borderColor: 'rgba(15,138,98,0.20)',
  },
  nopeOverlay: {
    backgroundColor: 'rgba(255,241,242,0.94)',
    borderColor: 'rgba(180,35,72,0.18)',
  },
  likeOverlayText: {
    fontFamily: titleFontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#0F8A62',
  },
  nopeOverlayText: {
    fontFamily: titleFontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#B42348',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  sectorTag: {
    flex: 1,
    alignSelf: 'flex-start',
    maxWidth: '68%',
    borderRadius: 999,
    backgroundColor: 'rgba(45,190,139,0.11)',
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  sectorText: {
    fontFamily: titleFontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#0F6F50',
  },
  scoreBadge: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F7FAF8',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  scoreValue: {
    fontFamily: titleFontFamily,
    fontSize: 18,
    color: Colors.accent.primary,
  },
  heroPanel: {
    height: 152,
    justifyContent: 'flex-start',
    borderRadius: 8,
    backgroundColor: '#F7FAF8',
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  cardKicker: {
    marginBottom: 18,
    fontFamily: titleFontFamily,
    fontSize: 12,
    color: Colors.text.muted,
  },
  cardTitle: {
    fontFamily: titleFontFamily,
    fontSize: 25,
    lineHeight: 31,
    color: Colors.text.strong,
  },
  reasonsPanel: {
    minHeight: 82,
    paddingTop: 12,
    gap: 8,
  },
  matchCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderWidth: 1,
    borderColor: '#EFE7DA',
    gap: 8,
  },
  score: {
    fontFamily: titleFontFamily,
    fontSize: 46,
    color: Colors.accent.primary,
  },
  scoreLabel: {
    fontFamily: labelFontFamily,
    fontSize: 13,
    color: Colors.text.muted,
  },
  jobTitle: {
    marginTop: 8,
    fontFamily: titleFontFamily,
    fontSize: 25,
    color: Colors.text.strong,
  },
  jobSector: {
    fontFamily: bodyFontFamily,
    fontSize: 15,
    color: Colors.text.muted,
  },
  reasons: {
    marginTop: 12,
    gap: 10,
  },
  reasonRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  reasonText: {
    flex: 1,
    fontFamily: bodyFontFamily,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text.strong,
  },
  cardFooter: {
    marginTop: 'auto',
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 21,
    alignSelf: 'flex-start',
  },
  detailButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: labelFontFamily,
    color: Colors.accent.primary,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  choiceButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dislikeButton: {
    backgroundColor: '#FFF4E6',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  likeButton: {
    backgroundColor: Colors.accent.primary,
  },
  dislikeText: {
    fontFamily: labelFontFamily,
    color: '#B54708',
  },
  likeText: {
    fontFamily: labelFontFamily,
    color: '#FFFFFF',
  },
  card: {
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFE7DA',
    padding: 14,
  },
  likedRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EADF',
  },
  likedCopy: {
    flex: 1,
  },
  likedTitle: {
    fontFamily: labelFontFamily,
    fontSize: 15,
    color: Colors.text.strong,
  },
  likedMeta: {
    marginTop: 4,
    fontFamily: bodyFontFamily,
    fontSize: 13,
    color: Colors.text.muted,
  },
  actions: {
    gap: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C5148',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6,
  },
  dislikeRoundButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(180,35,72,0.10)',
  },
  likeRoundButton: {
    backgroundColor: Colors.accent.primary,
  },
  emptyTitle: {
    fontFamily: titleFontFamily,
    fontSize: 24,
    color: Colors.text.strong,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: bodyFontFamily,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text.muted,
    textAlign: 'center',
  },
});
