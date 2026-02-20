import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import BackgroundBubbles from './BackgroundBubbles';

type Props = {
  children?: React.ReactNode;
  bubbles?: boolean;
};

export default function BackgroundRadial({ children, bubbles = false }: Props) {
  return (
    <View style={styles.container}>
      {/* Gradient tout en bas */}
      <LinearGradient
        colors={['#e6c598ff', '#f0d5aeff', '#fceedaff']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      {bubbles ? (
        <View style={styles.bubblesLayer} pointerEvents="none">
          <BackgroundBubbles />
        </View>
      ) : null}

      {/* Contenu au-dessus de tout */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
