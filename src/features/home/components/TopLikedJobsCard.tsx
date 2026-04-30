import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { TopLikedJob } from '@/features/jobs';
import Colors from '@/themes/colors';
import { displayFontFamily, titleFontFamily } from '@/themes/typography';
import {
  cardSurface,
  neutralBadge,
  neutralBadgeText,
  secondaryButton,
  secondaryButtonText,
} from '@/themes/ui';

type Props = {
  jobs: TopLikedJob[];
  onJobPress: (jobId: string) => void;
  onSwipePress: () => void;
};

export default function TopLikedJobsCard({
  jobs,
  onJobPress,
  onSwipePress,
}: Props) {
  if (jobs.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Top métiers likés</Text>
        <Text style={styles.description}>
          Like des métiers pour faire émerger tes favoris.
        </Text>
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.button}
          onPress={onSwipePress}
        >
          <Text style={styles.buttonText}>Découvrir des métiers</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Top métiers likés</Text>
      <Text style={styles.label}>Tes favoris du moment</Text>

      <View style={styles.jobs}>
        {jobs.slice(0, 3).map((job, index) => (
          <TouchableOpacity
            key={job.id}
            activeOpacity={0.86}
            style={styles.jobRow}
            onPress={() => onJobPress(job.id)}
          >
            <View style={styles.rank}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>

            <View style={styles.jobBody}>
              <Text style={styles.jobTitle} numberOfLines={2}>
                {job.title}
              </Text>
              {job.sector ? (
                <Text style={styles.jobSector} numberOfLines={1}>
                  {job.sector}
                </Text>
              ) : null}
              {job.code ? (
                <View style={styles.codeBadge}>
                  <Text style={styles.codeBadgeText}>ROME {job.code}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.likesCount}>
              {job.likesCount} like{job.likesCount > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.button}
        onPress={onSwipePress}
      >
        <Text style={styles.buttonText}>Continuer à swiper</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardSurface,
    padding: 20,
    marginBottom: 28,
  },
  title: {
    fontSize: 16,
    fontFamily: titleFontFamily,
    color: '#1F1F1F',
    opacity: 0.7,
    marginBottom: 6,
  },
  label: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '600',
    fontFamily: displayFontFamily,
    color: Colors.accent.strong,
    marginBottom: 14,
  },
  description: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    color: 'rgba(0,0,0,0.60)',
    lineHeight: 20,
  },
  jobs: {
    gap: 10,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.62)',
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent.primary,
  },
  rankText: {
    fontSize: 13,
    fontFamily: titleFontFamily,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  jobBody: {
    flex: 1,
    gap: 4,
  },
  jobTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: titleFontFamily,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  jobSector: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.58)',
  },
  codeBadge: {
    ...neutralBadge,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  codeBadgeText: {
    ...neutralBadgeText,
    fontSize: 11,
  },
  likesCount: {
    flexShrink: 0,
    fontSize: 12,
    fontFamily: titleFontFamily,
    fontWeight: '700',
    color: Colors.accent.strong,
  },
  button: {
    ...secondaryButton,
    marginTop: 14,
  },
  buttonText: {
    ...secondaryButtonText,
  },
});
