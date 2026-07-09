import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Branding } from '@/assets';
import KeyboardAwareScrollView from '@/components/layout/KeyboardAwareScrollView';

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#F8F4EE', '#F5F1EA', '#F9F6EF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.absoluteFill}
      />
      <View style={styles.circleTop} pointerEvents="none" />
      <View style={styles.circleMiddle} pointerEvents="none" />
      <View style={styles.diagonalBand} pointerEvents="none" />

      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoWrap}>
            <Branding.Logo width={198} height={84} />
          </View>

          {children}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F4EE',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 34,
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 18,
    zIndex: 2,
  },
  circleTop: {
    position: 'absolute',
    top: -58,
    right: -44,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  circleMiddle: {
    position: 'absolute',
    top: 228,
    left: -62,
    width: 214,
    height: 214,
    borderRadius: 107,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  diagonalBand: {
    position: 'absolute',
    top: -60,
    right: 36,
    width: 210,
    height: 780,
    backgroundColor: 'rgba(31,31,31,0.024)',
    transform: [{ rotate: '22deg' }],
  },
});
