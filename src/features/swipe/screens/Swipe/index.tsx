import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSwipe } from '@/features/swipe/hooks/useSwipe';
import Colors from '@/themes/colors';
import { RootStackParamList, TabParamList } from '@/types/navigation';

import { styles } from './styles';

const SWIPE_THRESHOLD = 120;

type SwipeNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Swipe'>,
  NativeStackNavigationProp<RootStackParamList>
>;

function SwipeBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.backgroundRoot}>
      <LinearGradient
        colors={['#F8F4EE', '#EEF6F1', '#F7F4EF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.absoluteFill}
      />

      <LinearGradient
        colors={[
          'rgba(255,167,38,0.18)',
          'rgba(255,167,38,0.05)',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.7 }}
        style={styles.backgroundWash}
      />

      <LinearGradient
        colors={[
          'rgba(45,190,139,0.20)',
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
  const navigation = useNavigation<SwipeNavigation>();
  const { deck, remaining, limit, loading, error, loadDeck, swipe } =
    useSwipe();

  useFocusEffect(
    useCallback(() => {
      if (deck.length === 0 && remaining === null) {
        loadDeck();
      }
    }, [deck.length, loadDeck, remaining]),
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
  const swipedToday =
    remaining !== null && limit !== null ? Math.max(limit - remaining, 0) : 0;
  const progress =
    remaining !== null && limit ? Math.min(swipedToday / limit, 1) : 0;

  const openCurrentJob = useCallback(() => {
    if (!currentJob) return;
    navigation.navigate('JobDetail', { jobId: currentJob.id });
  }, [currentJob, navigation]);

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
            <Text style={styles.headerTitle}>Métiers à explorer</Text>
            <Text style={styles.headerSubtitle}>
              Swipe ou consulte la fiche.
            </Text>
          </View>

          {remaining !== null && (
            <View style={styles.remainingPill}>
              <Text style={styles.remainingValue}>{remaining}</Text>
              <Text style={styles.remainingLabel}>swipes</Text>
            </View>
          )}
        </View>

        {limit !== null && remaining !== null ? (
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {swipedToday}/{limit} swipes utilisés
            </Text>
          </View>
        ) : null}

        <View style={styles.cardArea}>
          {afterNextJob && <View style={styles.cardShadowBackMost} />}

          {nextJob && <View style={styles.cardShadowBack} />}

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
              <MaterialIcons name="favorite" size={24} color="#0F8A62" />
              <Text style={styles.likeLabel}>Je garde</Text>
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
              <MaterialIcons name="close" size={24} color="#B42348" />
              <Text style={styles.nopeLabel}>Je passe</Text>
            </Animated.View>

            <TouchableOpacity
              activeOpacity={0.96}
              style={styles.cardPressArea}
              onPress={openCurrentJob}
            >
              <LinearGradient
                colors={['rgba(29,185,132,0.16)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              />

              <View style={styles.cardTop}>
                <View style={styles.cardTopLeft}>
                  {currentJob?.sector ? (
                    <View style={styles.sectorTag}>
                      <Text style={styles.sectorText} numberOfLines={1}>
                        {currentJob.sector}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <View style={styles.heroPanel}>
                <View style={styles.titleAccent} />
                <Text style={styles.cardTitle} numberOfLines={5}>
                  {currentJob?.title}
                </Text>
              </View>

              {currentJob?.tags && currentJob.tags.length > 0 && (
                <View style={styles.tagsSection}>
                  <View style={styles.tagsRow}>
                    {currentJob.tags.slice(0, 1).map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText} numberOfLines={1}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.cardFooter}>
                <View style={styles.footerButton}>
                  <Text style={styles.footerText}>Voir la fiche</Text>
                </View>
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={styles.footerIcon}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.dislikeBtn]}
            onPress={() => animateOutRef.current('dislike')}
          >
            <MaterialIcons name="close" size={30} color="#B42348" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.likeBtn]}
            onPress={() => animateOutRef.current('like')}
          >
            <MaterialIcons name="favorite" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SwipeBackground>
  );
}
