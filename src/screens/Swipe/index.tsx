import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/Background/BackgroundRadial';
import { useSwipe } from '@/hooks/useSwipe';

const SWIPE_THRESHOLD = 120;

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
  }, [deck]);

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
    inputRange: [-200, 0, 200],
    outputRange: ['-10deg', '0deg', '10deg'],
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

  const currentJob = deck[0] ?? null;

  if (loading || (deck.length === 0 && remaining !== null && remaining > 0)) {
    return (
      <BackgroundRadial>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.statusText}>Chargement...</Text>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

  if (error) {
    return (
      <BackgroundRadial>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDeck}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

  if (remaining === 0) {
    return (
      <BackgroundRadial>
        <SafeAreaView style={styles.centered}>
          <MaterialIcons name="check-circle" size={64} color="#2DAC5C" />
          <Text style={styles.quotaTitle}>C'est tout pour aujourd'hui !</Text>
          <Text style={styles.quotaSubtitle}>
            Tu as utilisé tous tes swipes du jour.{'\n'}Reviens demain pour
            découvrir de nouveaux métiers.
          </Text>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

  if (deck.length === 0) {
    return (
      <BackgroundRadial>
        <SafeAreaView style={styles.centered}>
          <MaterialIcons name="work-off" size={64} color="#888" />
          <Text style={styles.quotaTitle}>Aucun métier disponible</Text>
          <Text style={styles.quotaSubtitle}>
            Tu as déjà vu tous les métiers récemment.{'\n'}Reviens plus tard !
          </Text>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

  return (
    <BackgroundRadial>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Découvrir des métiers</Text>
          {remaining !== null && (
            <Text style={styles.remaining}>{remaining} restant(s)</Text>
          )}
        </View>

        <View style={styles.cardArea}>
          {deck[1] && (
            <View style={styles.cardBehind} pointerEvents="none">
              <Text style={styles.cardTitle}>{deck[1].title}</Text>
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
                { opacity: likeOpacity },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.likeLabel}>J'AIME</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.overlay,
                styles.nopeOverlay,
                { opacity: nopeOpacity },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.nopeLabel}>PASSER</Text>
            </Animated.View>

            {currentJob?.sector && (
              <View style={styles.sectorTag}>
                <Text style={styles.sectorText}>{currentJob.sector}</Text>
              </View>
            )}

            <Text style={styles.cardTitle}>{currentJob?.title}</Text>

            {currentJob?.description && (
              <Text style={styles.cardDescription} numberOfLines={6}>
                {currentJob.description}
              </Text>
            )}

            {currentJob?.tags && currentJob.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {currentJob.tags.slice(0, 4).map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.dislikeBtn]}
            onPress={() => animateOutRef.current('dislike')}
          >
            <MaterialIcons name="close" size={32} color="#DC2626" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.likeBtn]}
            onPress={() => animateOutRef.current('like')}
          >
            <MaterialIcons name="favorite" size={32} color="#2DAC5C" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A2916',
  },
  remaining: {
    fontSize: 14,
    color: '#555',
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBehind: {
    position: 'absolute',
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    opacity: 0.5,
    transform: [{ scale: 0.96 }, { translateY: 10 }],
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  card: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    maxHeight: '85%',
  },
  overlay: {
    position: 'absolute',
    top: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 3,
    zIndex: 10,
  },
  likeOverlay: {
    left: 20,
    borderColor: '#2DAC5C',
    transform: [{ rotate: '-15deg' }],
  },
  nopeOverlay: {
    right: 20,
    borderColor: '#DC2626',
    transform: [{ rotate: '15deg' }],
  },
  likeLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2DAC5C',
  },
  nopeLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: '#DC2626',
  },
  sectorTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5EE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  sectorText: {
    fontSize: 12,
    color: '#0A2916',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A2916',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingBottom: 24,
    paddingTop: 12,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dislikeBtn: {
    backgroundColor: '#FFF0F0',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  likeBtn: {
    backgroundColor: '#F0FFF4',
    borderWidth: 2,
    borderColor: '#2DAC5C',
  },
  statusText: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0A2916',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  quotaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A2916',
    textAlign: 'center',
    marginTop: 16,
  },
  quotaSubtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
});
