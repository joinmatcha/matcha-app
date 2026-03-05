import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSwipe } from '@/features/swipe/hooks/useSwipe';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  displayFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { cardSurface, primaryButton, primaryButtonText } from '@/themes/ui';

const SWIPE_THRESHOLD = 120;

function SwipeBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.backgroundRoot}>
      <LinearGradient
        colors={['#11151C', '#0D1117', '#090C12']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <LinearGradient
        colors={[
          'rgba(255,107,138,0.22)',
          'rgba(255,107,138,0.06)',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.7 }}
        style={styles.backgroundWash}
      />

      <LinearGradient
        colors={[
          'rgba(45,190,139,0.24)',
          'rgba(45,190,139,0.06)',
          'transparent',
        ]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundWash}
      />

      <View style={styles.diagonalBandOne} pointerEvents="none" />
      <View style={styles.diagonalBandTwo} pointerEvents="none" />
      <View style={styles.diagonalBandThree} pointerEvents="none" />

      <View style={styles.backgroundContent}>{children}</View>
    </View>
  );
}

export default function SwipeScreen() {
  const { deck, remaining, loading, error, loadDeck, swipe } = useSwipe();

  useFocusEffect(
    useCallback(() => {
      loadDeck();
    }, [loadDeck]),
  );

  const pan = useRef(new Animated.ValueXY()).current;
  const currentJobRef = useRef(deck[0] ?? null);
  currentJobRef.current = deck[0] ?? null;

  const isAnimating = useRef(false);

  useEffect(() => {
    pan.x.setValue(0);
    isAnimating.current = false;
  }, [deck, pan.x]);

  const animateOutRef = useRef<(action: 'like' | 'dislike') => void>(() => {});
  animateOutRef.current = (action: 'like' | 'dislike') => {
    if (isAnimating.current) return;
    const job = currentJobRef.current;
    if (!job) return;

    isAnimating.current = true;
    const toX = action === 'like' ? 500 : -500;

    Animated.timing(pan.x, {
      toValue: toX,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      swipe(job.id, action);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnimating.current,
      onMoveShouldSetPanResponder: (_, gesture) =>
        !isAnimating.current &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
        Math.abs(gesture.dx) > 5,
      onPanResponderGrant: () => {
        pan.x.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        if (isAnimating.current) return;
        pan.x.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          animateOutRef.current('like');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          animateOutRef.current('dislike');
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

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

  const likeScale = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0.9, 1],
    extrapolate: 'clamp',
  });

  const nopeScale = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const currentJob = deck[0] ?? null;
  const nextJob = deck[1] ?? null;
  const afterNextJob = deck[2] ?? null;

  if (loading || (deck.length === 0 && remaining !== null && remaining > 0)) {
    return (
      <SwipeBackground>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.centered}>
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color={Colors.greenDark.normal} />
            <Text style={styles.stateTitle}>Préparation de ton deck</Text>
            <Text style={styles.stateSubtitle}>
              On sélectionne les prochains métiers à te proposer.
            </Text>
          </View>
        </SafeAreaView>
      </SwipeBackground>
    );
  }

  if (error) {
    return (
      <SwipeBackground>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.centered}>
          <View style={styles.stateCard}>
            <MaterialIcons
              name="wifi-off"
              size={36}
              color={Colors.orange.normal}
            />
            <Text style={styles.stateTitle}>
              Impossible de charger les métiers
            </Text>
            <Text style={styles.stateSubtitle}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadDeck}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SwipeBackground>
    );
  }

  if (remaining === 0) {
    return (
      <SwipeBackground>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.centered}>
          <View style={styles.stateCard}>
            <View style={styles.stateIconWrap}>
              <MaterialIcons
                name="favorite"
                size={30}
                color={Colors.greenDark.normal}
              />
            </View>
            <Text style={styles.stateTitle}>
              Tu as tout vu pour aujourd&apos;hui
            </Text>
            <Text style={styles.stateSubtitle}>
              Tu as utilisé tous tes swipes du jour. Reviens demain pour
              découvrir de nouveaux métiers.
            </Text>
          </View>
        </SafeAreaView>
      </SwipeBackground>
    );
  }

  if (deck.length === 0) {
    return (
      <SwipeBackground>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.centered}>
          <View style={styles.stateCard}>
            <View style={styles.stateIconWrap}>
              <MaterialIcons
                name="work-outline"
                size={30}
                color={Colors.greenDark.normal}
              />
            </View>
            <Text style={styles.stateTitle}>Aucun métier disponible</Text>
            <Text style={styles.stateSubtitle}>
              Tu as déjà vu les métiers disponibles récemment. Reviens plus
              tard.
            </Text>
          </View>
        </SafeAreaView>
      </SwipeBackground>
    );
  }

  return (
    <SwipeBackground>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>MATCHING MÉTIERS</Text>
            <Text style={styles.headerTitle}>
              Swipe les métiers qui te parlent
            </Text>
            <Text style={styles.headerSubtitle}>
              Passe ou garde en un geste.
            </Text>
          </View>

          {remaining !== null && (
            <View style={styles.remainingPill}>
              <Text style={styles.remainingValue}>{remaining}</Text>
              <Text style={styles.remainingLabel}>restants</Text>
            </View>
          )}
        </View>

        <View style={styles.cardArea}>
          {afterNextJob && <View style={styles.cardShadowBackMost} />}

          {nextJob && (
            <View style={styles.cardShadowBack}>
              <Text numberOfLines={1} style={styles.backCardTitle}>
                {nextJob.title}
              </Text>
            </View>
          )}

          <Animated.View
            style={[
              styles.card,
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
                {
                  opacity: likeOpacity,
                  transform: [{ translateY: 8 }, { scale: likeScale }],
                },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.likeLabel}>LIKE</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.overlay,
                styles.nopeOverlay,
                {
                  opacity: nopeOpacity,
                  transform: [{ translateY: 8 }, { scale: nopeScale }],
                },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.nopeLabel}>NON</Text>
            </Animated.View>

            <LinearGradient
              colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            />

            <View style={styles.cardTop}>
              {currentJob?.sector ? (
                <View style={styles.sectorTag}>
                  <Text style={styles.sectorText}>{currentJob.sector}</Text>
                </View>
              ) : (
                <View />
              )}
            </View>

            <View style={styles.heroPanel}>
              <Text style={styles.cardTitle}>{currentJob?.title}</Text>

              {currentJob?.description && (
                <Text style={styles.cardDescription} numberOfLines={5}>
                  {currentJob.description}
                </Text>
              )}
            </View>

            {currentJob?.tags && currentJob.tags.length > 0 && (
              <View style={styles.tagsSection}>
                <View style={styles.tagsRow}>
                  {currentJob.tags.slice(0, 5).map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Animated.View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.dislikeBtn]}
            onPress={() => animateOutRef.current('dislike')}
          >
            <MaterialIcons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.likeBtn]}
            onPress={() => animateOutRef.current('like')}
          >
            <MaterialIcons name="favorite" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SwipeBackground>
  );
}

const styles = StyleSheet.create({
  backgroundRoot: {
    flex: 1,
    backgroundColor: '#0B0D11',
  },
  backgroundWash: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  backgroundContent: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  diagonalBandOne: {
    position: 'absolute',
    top: -40,
    right: -90,
    width: 280,
    height: 640,
    backgroundColor: 'rgba(255,255,255,0.04)',
    transform: [{ rotate: '22deg' }],
  },
  diagonalBandTwo: {
    position: 'absolute',
    top: 180,
    left: -120,
    width: 260,
    height: 560,
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: [{ rotate: '-18deg' }],
  },
  diagonalBandThree: {
    position: 'absolute',
    bottom: -80,
    right: 10,
    width: 220,
    height: 420,
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: [{ rotate: '28deg' }],
  },
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stateCard: {
    ...cardSurface,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: 'rgba(19,22,28,0.92)',
  },
  stateIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EEF4F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  stateTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: titleFontFamily,
    fontWeight: '700',
    color: '#F5F7FA',
    textAlign: 'center',
  },
  stateSubtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: bodyFontFamily,
    color: 'rgba(233,238,244,0.78)',
    textAlign: 'center',
  },
  retryButton: {
    ...primaryButton,
    marginTop: 18,
    minHeight: 48,
    paddingHorizontal: 24,
  },
  retryText: {
    ...primaryButtonText,
    fontFamily: titleFontFamily,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    letterSpacing: 1.1,
    color: 'rgba(255,255,255,0.56)',
  },
  headerTitle: {
    marginTop: 4,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: displayFontFamily,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: 'rgba(235,239,244,0.9)',
  },
  remainingPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  remainingValue: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: titleFontFamily,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  remainingLabel: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: bodyFontFamily,
    color: 'rgba(255,255,255,0.78)',
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 2,
  },
  cardShadowBackMost: {
    position: 'absolute',
    width: '84%',
    height: '72%',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 30,
    transform: [{ translateX: -10 }, { translateY: 18 }, { rotate: '-4deg' }],
  },
  cardShadowBack: {
    position: 'absolute',
    width: '86%',
    height: '70%',
    ...cardSurface,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 24,
    opacity: 0.98,
    transform: [{ translateX: 12 }, { translateY: 12 }, { rotate: '3deg' }],
  },
  backCardTitle: {
    fontSize: 19,
    fontFamily: titleFontFamily,
    fontWeight: '600',
    color: 'rgba(25,28,34,0.45)',
  },
  card: {
    width: '90%',
    minHeight: '68%',
    maxHeight: '74%',
    ...cardSurface,
    backgroundColor: 'rgba(13,18,26,0.96)',
    overflow: 'hidden',
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  overlay: {
    position: 'absolute',
    top: 86,
    alignSelf: 'center',
    minWidth: 176,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeOverlay: {
    backgroundColor: 'rgba(45,190,139,0.22)',
  },
  nopeOverlay: {
    backgroundColor: 'rgba(255,96,122,0.18)',
  },
  likeLabel: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: '#75F7C8',
    letterSpacing: 1.4,
  },
  nopeLabel: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: '#FF6B8A',
    letterSpacing: 1.4,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectorTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(45,190,139,0.2)',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  sectorText: {
    fontSize: 12,
    fontFamily: titleFontFamily,
    color: '#B7FEE1',
    fontWeight: '600',
  },
  cardBody: {
    flex: 1,
  },
  heroPanel: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    minHeight: 260,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: titleFontFamily,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  cardDescription: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: bodyFontFamily,
    color: 'rgba(235,239,244,0.95)',
  },
  tagsSection: {
    paddingTop: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontFamily: titleFontFamily,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 6,
    paddingBottom: 22,
  },
  actionBtn: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9A8A79',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  dislikeBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  likeBtn: {
    backgroundColor: '#1F8A65',
  },
});
