import React from 'react';
import { Text, View } from 'react-native';

import { styles } from '../styles';

const getTensionActiveStyle = (value: number) => {
  if (value <= 1) return styles.trendBarLow;
  if (value === 2) return styles.trendBarModerate;
  if (value === 3) return styles.trendBarMedium;
  if (value === 4) return styles.trendBarHigh;
  return styles.trendBarVeryHigh;
};

const getTensionInactiveStyle = (value: number) => {
  if (value <= 1) return styles.trendBarLowMuted;
  if (value === 2) return styles.trendBarModerateMuted;
  if (value === 3) return styles.trendBarMediumMuted;
  if (value === 4) return styles.trendBarHighMuted;
  return styles.trendBarVeryHighMuted;
};

const getTensionTextStyle = (value: number) => {
  if (value <= 1) return styles.tensionValueLow;
  if (value === 2) return styles.tensionValueModerate;
  if (value === 3) return styles.tensionValueMedium;
  if (value === 4) return styles.tensionValueHigh;
  return styles.tensionValueVeryHigh;
};

const getTensionCardStyle = (value: number) => {
  if (value <= 1) return styles.tensionCardLow;
  if (value === 2) return styles.tensionCardModerate;
  if (value === 3) return styles.tensionCardMedium;
  if (value === 4) return styles.tensionCardHigh;
  return styles.tensionCardVeryHigh;
};

export function SalaryDashboard({
  average,
  beginner,
  experienced,
  period,
}: {
  average: string;
  beginner?: string;
  experienced?: string;
  period?: string;
}) {
  return (
    <View style={styles.salaryDashboard}>
      <View>
        <Text style={styles.dashboardEyebrow}>Salaire moyen</Text>
        <Text style={styles.salaryDashboardValue}>{average}</Text>
        {period ? (
          <Text style={styles.salaryDashboardMeta}>{period}</Text>
        ) : null}
      </View>

      {beginner || experienced ? (
        <View style={styles.salaryRange}>
          {beginner ? (
            <View style={styles.salaryRangeItem}>
              <Text style={styles.salaryRangeLabel}>Débutant</Text>
              <Text style={styles.salaryRangeValue}>{beginner}</Text>
            </View>
          ) : null}
          {experienced ? (
            <View style={styles.salaryRangeItem}>
              <Text style={styles.salaryRangeLabel}>Expérimenté</Text>
              <Text style={styles.salaryRangeValue}>{experienced}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function TensionTrend({
  value,
  label,
  helper,
}: {
  value: number;
  label?: string;
  helper?: string;
}) {
  const activeStyle = getTensionActiveStyle(value);
  const inactiveStyle = getTensionInactiveStyle(value);
  const textStyle = getTensionTextStyle(value);
  const cardStyle = getTensionCardStyle(value);

  return (
    <View style={[styles.tensionCard, cardStyle]}>
      <View style={styles.tensionHeader}>
        <View>
          <Text style={styles.dashboardEyebrowDark}>Tension du marché</Text>
          <Text style={[styles.tensionValue, textStyle]}>
            {label ?? 'Indice'}
          </Text>
        </View>
      </View>

      <View style={styles.trendChart}>
        {[1, 2, 3, 4, 5].map((segment) => (
          <View key={segment} style={styles.trendColumn}>
            <View
              style={[
                styles.trendBar,
                { height: 18 + segment * 8 },
                segment <= value ? activeStyle : inactiveStyle,
              ]}
            />
          </View>
        ))}
      </View>

      {helper ? <Text style={styles.tensionHelper}>{helper}</Text> : null}
    </View>
  );
}

export function ActivityStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <View style={styles.activityStatCard}>
      <Text style={styles.activityStatLabel}>{label}</Text>
      <Text style={styles.activityStatValue}>{value}</Text>
      {helper ? <Text style={styles.activityHelper}>{helper}</Text> : null}
    </View>
  );
}
