import React, { ReactNode, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../styles';

const limitItems = <T,>(items: T[], limit: number) => ({
  visible: items.slice(0, limit),
  hiddenCount: Math.max(items.length - limit, 0),
});

export function SectionCard({
  title,
  children,
  compact = false,
}: {
  title: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <View style={[styles.sectionCard, compact && styles.sectionCardCompact]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function ChipList({
  items,
  limit,
  tone = 'green',
}: {
  items: string[];
  limit?: number;
  tone?: 'green' | 'neutral';
}) {
  const [expanded, setExpanded] = useState(false);
  const shouldLimit = Boolean(limit && !expanded);
  const { visible, hiddenCount } =
    limit && shouldLimit
      ? limitItems(items, limit)
      : { visible: items, hiddenCount: 0 };

  if (!visible.length) return null;

  return (
    <View style={styles.chipWrap}>
      {visible.map((item, index) => (
        <View
          key={`${item}-${index}`}
          style={[
            styles.chip,
            tone === 'neutral' ? styles.chipNeutral : styles.chipGreen,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              tone === 'neutral'
                ? styles.chipTextNeutral
                : styles.chipTextGreen,
            ]}
          >
            {item}
          </Text>
        </View>
      ))}
      {limit && !expanded && items.length > limit ? (
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.chip, styles.chipMore]}
          onPress={() => setExpanded(true)}
        >
          <Text style={[styles.chipText, styles.chipTextNeutral]}>
            +{hiddenCount}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function InfoRows({
  rows,
}: {
  rows: Array<{ label: string; value?: string }>;
}) {
  const visibleRows = rows.filter((row) => row.value);

  if (!visibleRows.length) return null;

  return (
    <View style={styles.infoRows}>
      {visibleRows.map((row) => (
        <View key={row.label} style={styles.infoRow}>
          <Text style={styles.infoLabel}>{row.label}</Text>
          <Text style={styles.infoValue}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function CompactList({
  items,
  limit,
}: {
  items: Array<{ title: string; meta?: string }>;
  limit?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const shouldLimit = Boolean(limit && !expanded);
  const { visible, hiddenCount } =
    limit && shouldLimit
      ? limitItems(items, limit)
      : { visible: items, hiddenCount: 0 };

  if (!visible.length) return null;

  return (
    <View style={styles.compactList}>
      {visible.map((item, index) => (
        <View key={`${item.title}-${index}`} style={styles.compactRow}>
          <View style={styles.compactMarker} />
          <View style={styles.compactTextWrap}>
            <Text style={styles.compactTitle}>{item.title}</Text>
            {item.meta ? (
              <Text style={styles.compactMeta}>{item.meta}</Text>
            ) : null}
          </View>
        </View>
      ))}

      {limit && !expanded && items.length > limit ? (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.inlineMoreButton}
          onPress={() => setExpanded(true)}
        >
          <Text style={styles.inlineMoreText}>Voir {hiddenCount} de plus</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function ProfileInsight({
  riasec,
  interests,
}: {
  riasec: string[];
  interests: string[];
}) {
  return (
    <View style={styles.profileInsight}>
      {riasec.length ? (
        <View style={styles.profileBlock}>
          <Text style={styles.profileLabel}>Profil dominant</Text>
          <Text style={styles.profileValue}>
            {riasec.slice(0, 2).join(' · ')}
          </Text>
        </View>
      ) : null}

      {interests.length ? (
        <View style={styles.profileBlock}>
          <Text style={styles.profileLabel}>Ce métier peut te plaire si</Text>
          <CompactList
            items={interests.map((interest) => ({ title: interest }))}
            limit={3}
          />
        </View>
      ) : null}
    </View>
  );
}
