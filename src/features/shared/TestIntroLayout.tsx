import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppScreen from '@/components/layout/AppScreen';
import MatchaButton from '@/components/ui/MatchaButton';
import SurfaceCard from '@/components/ui/SurfaceCard';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';

type Stat = {
  value: string;
  label: string;
};

type Tile = {
  title: string;
  subtitle: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stats: Stat[];
  flowTitle?: string;
  flow?: string[];
  benefitsTitle: string;
  benefits: Tile[];
  noteTitle?: string;
  note?: string;
  ctaLabel: string;
  onPress: () => void;
};

export default function TestIntroLayout({
  eyebrow,
  title,
  subtitle,
  stats,
  flowTitle,
  flow = [],
  benefitsTitle,
  benefits,
  noteTitle,
  note,
  ctaLabel,
  onPress,
}: Props) {
  return (
    <AppScreen>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <SurfaceCard style={styles.hero}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </SurfaceCard>

          <View style={styles.stats}>
            {stats.map((stat) => (
              <SurfaceCard key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </SurfaceCard>
            ))}
          </View>

          {flow.length > 0 && flowTitle ? (
            <SurfaceCard style={styles.card}>
              <Text style={styles.cardTitle}>{flowTitle}</Text>
              {flow.map((step, index) => (
                <View key={step} style={styles.stepRow}>
                  <View style={styles.stepIndex}>
                    <Text style={styles.stepIndexText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </SurfaceCard>
          ) : null}

          <SurfaceCard style={styles.card}>
            <Text style={styles.cardTitle}>{benefitsTitle}</Text>
            <View style={styles.grid}>
              {benefits.map((item) => (
                <View key={item.title} style={styles.tile}>
                  <Text style={styles.tileTitle}>{item.title}</Text>
                  <Text style={styles.tileSubtitle}>{item.subtitle}</Text>
                </View>
              ))}
            </View>
          </SurfaceCard>

          {note && noteTitle ? (
            <SurfaceCard style={styles.card}>
              <Text style={styles.cardTitle}>{noteTitle}</Text>
              <Text style={styles.note}>{note}</Text>
            </SurfaceCard>
          ) : null}

          <MatchaButton
            label={ctaLabel}
            variant="primary"
            icon="arrow-forward"
            onPress={onPress}
            fullWidth
          />
        </ScrollView>
      </SafeAreaView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 40,
    gap: 14,
  },
  hero: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  eyebrow: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: titleFontFamily,
    color: Colors.accent.primary,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: titleFontFamily,
    fontWeight: '600',
    color: Colors.text.strong,
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: 9,
    fontSize: 16,
    lineHeight: 23,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flex: 1,
    minHeight: 78,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  statValue: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: titleFontFamily,
    fontWeight: '600',
    color: Colors.accent.primary,
    textAlign: 'center',
  },
  statLabel: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  card: {
    padding: 16,
  },
  cardTitle: {
    marginBottom: 8,
    fontSize: 17,
    lineHeight: 22,
    fontFamily: titleFontFamily,
    fontWeight: '600',
    color: Colors.text.strong,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  stepIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndexText: {
    color: Colors.accent.strong,
    fontSize: 12,
    fontFamily: titleFontFamily,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    color: Colors.text.muted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    width: '48%',
    backgroundColor: '#F7FAF8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tileTitle: {
    color: Colors.text.strong,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: titleFontFamily,
    fontWeight: '600',
  },
  tileSubtitle: {
    marginTop: 3,
    color: Colors.text.muted,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: bodyFontFamily,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
});
