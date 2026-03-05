import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import BackgroundBubbles from './BackgroundBubbles';

type BackgroundVariant = 'green' | 'beige';

const DEFAULT_BACKGROUND_VARIANT: BackgroundVariant = 'green';

const paletteByVariant: Record<
  BackgroundVariant,
  {
    base: [string, string, string];
    washOne: [string, string, string];
    washTwo: [string, string, string];
    container: string;
  }
> = {
  green: {
    base: ['#F4F8F2', '#EBF2E6', '#E3ECDD'],
    washOne: ['rgba(92,138,95,0.18)', 'rgba(92,138,95,0.04)', 'transparent'],
    washTwo: ['rgba(146,178,132,0.2)', 'rgba(146,178,132,0.05)', 'transparent'],
    container: '#E8F0E6',
  },
  beige: {
    base: ['#FFFDF9', '#F6EFE6', '#EEE4D7'],
    washOne: [
      'rgba(198,144,109,0.16)',
      'rgba(198,144,109,0.05)',
      'transparent',
    ],
    washTwo: [
      'rgba(228,188,154,0.18)',
      'rgba(228,188,154,0.05)',
      'transparent',
    ],
    container: '#F2E6D8',
  },
};

type Props = {
  children?: React.ReactNode;
  bubbles?: boolean;
  variant?: BackgroundVariant;
};

export default function BackgroundRadial({
  children,
  bubbles = false,
  variant = DEFAULT_BACKGROUND_VARIANT,
}: Props) {
  const palette = paletteByVariant[variant];

  return (
    <View style={[styles.container, { backgroundColor: palette.container }]}>
      <LinearGradient
        colors={palette.base}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <LinearGradient
        colors={palette.washOne}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.7 }}
        style={styles.wash}
        pointerEvents="none"
      />

      <LinearGradient
        colors={palette.washTwo}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.wash}
        pointerEvents="none"
      />

      <View style={styles.diagonalBandOne} pointerEvents="none" />
      <View style={styles.diagonalBandTwo} pointerEvents="none" />
      <View style={styles.diagonalBandThree} pointerEvents="none" />

      {bubbles ? (
        <View style={styles.bubblesLayer} pointerEvents="none">
          <BackgroundBubbles />
        </View>
      ) : null}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wash: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
  diagonalBandOne: {
    position: 'absolute',
    top: -40,
    right: -90,
    width: 280,
    height: 640,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '22deg' }],
  },
  diagonalBandTwo: {
    position: 'absolute',
    top: 180,
    left: -120,
    width: 260,
    height: 560,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ rotate: '-18deg' }],
  },
  diagonalBandThree: {
    position: 'absolute',
    bottom: -80,
    right: 10,
    width: 220,
    height: 420,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '28deg' }],
  },

  bubblesLayer: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    zIndex: 0,
    elevation: 0,
  },

  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
    elevation: 1,
  },
});
