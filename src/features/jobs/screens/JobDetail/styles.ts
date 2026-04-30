import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'transparent' },
  container: { paddingBottom: 24 },
  bottomSpacer: { height: 34 },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  errorText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.93)',
    marginBottom: 12,
  },

  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F1F1F',
  },

  hero: {
    marginHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },

  romeCode: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#70635B',
    letterSpacing: 0.6,
  },

  title: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 14,
  },

  sectionCard: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.86)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 22,
    elevation: 2,
  },

  sectionCardCompact: {
    paddingVertical: 15,
  },

  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
    color: '#1B2530',
  },

  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(0,0,0,0.82)',
  },

  bulletList: {
    gap: 10,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    marginTop: 9,
    backgroundColor: '#2B8A6E',
  },

  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
    color: 'rgba(0,0,0,0.84)',
  },

  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 14,
  },

  statCard: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 116,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  statLabel: {
    marginBottom: 4,
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.47)',
  },

  statValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: '#1F1F1F',
  },

  dashboardStack: {
    gap: 10,
  },

  salaryDashboard: {
    gap: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#1F1F1F',
  },

  dashboardEyebrow: {
    marginBottom: 5,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.68)',
  },

  dashboardEyebrowDark: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.54)',
  },

  salaryDashboardValue: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  salaryDashboardMeta: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.58)',
  },

  salaryRange: {
    flexDirection: 'row',
    gap: 8,
  },

  salaryRangeItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 11,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },

  salaryRangeLabel: {
    marginBottom: 3,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.58)',
  },

  salaryRangeValue: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  tensionCard: {
    padding: 14,
    borderRadius: 18,
  },

  tensionCardLow: {
    backgroundColor: 'rgba(43,138,110,0.08)',
  },

  tensionCardModerate: {
    backgroundColor: 'rgba(127,163,58,0.10)',
  },

  tensionCardMedium: {
    backgroundColor: 'rgba(209,139,22,0.11)',
  },

  tensionCardHigh: {
    backgroundColor: 'rgba(212,106,44,0.11)',
  },

  tensionCardVeryHigh: {
    backgroundColor: 'rgba(180,35,72,0.10)',
  },

  tensionHeader: {
    gap: 3,
  },

  tensionValue: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    color: '#1F1F1F',
  },

  tensionValueLow: {
    color: '#2B8A6E',
  },

  tensionValueModerate: {
    color: '#6F8F25',
  },

  tensionValueMedium: {
    color: '#A66A00',
  },

  tensionValueHigh: {
    color: '#B8521E',
  },

  tensionValueVeryHigh: {
    color: '#B42348',
  },

  trendChart: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 7,
    height: 70,
    marginTop: 14,
    paddingHorizontal: 2,
  },

  trendColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  trendBar: {
    width: '100%',
    maxWidth: 42,
    borderRadius: 9,
  },

  trendBarLow: {
    backgroundColor: '#2B8A6E',
  },

  trendBarLowMuted: {
    backgroundColor: 'rgba(43,138,110,0.22)',
  },

  trendBarModerate: {
    backgroundColor: '#7FA33A',
  },

  trendBarModerateMuted: {
    backgroundColor: 'rgba(127,163,58,0.22)',
  },

  trendBarMedium: {
    backgroundColor: '#D18B16',
  },

  trendBarMediumMuted: {
    backgroundColor: 'rgba(209,139,22,0.24)',
  },

  trendBarHigh: {
    backgroundColor: '#D46A2C',
  },

  trendBarHighMuted: {
    backgroundColor: 'rgba(212,106,44,0.24)',
  },

  trendBarVeryHigh: {
    backgroundColor: '#B42348',
  },

  trendBarVeryHighMuted: {
    backgroundColor: 'rgba(180,35,72,0.22)',
  },

  tensionHelper: {
    marginTop: 9,
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(0,0,0,0.58)',
  },

  activityPanel: {
    padding: 13,
    borderRadius: 18,
    backgroundColor: 'rgba(31,31,31,0.04)',
  },

  activityPanelTitle: {
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    color: '#1F1F1F',
  },

  activityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  activityStatCard: {
    flexGrow: 1,
    flexBasis: '47%',
    minWidth: 128,
    paddingVertical: 11,
    paddingHorizontal: 11,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.64)',
  },

  activityStatLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.58)',
  },

  activityStatValue: {
    marginTop: 4,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    color: '#1F1F1F',
  },

  activityHelper: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    color: 'rgba(0,0,0,0.48)',
  },

  marketSourceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },

  marketSourcePill: {
    flexGrow: 1,
    flexBasis: '47%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(31,31,31,0.045)',
  },

  marketSourceLabel: {
    marginBottom: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.45)',
  },

  marketSourceValue: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.68)',
  },

  infoRows: {
    gap: 10,
  },

  infoRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(31,31,31,0.04)',
  },

  infoLabel: {
    marginBottom: 3,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.48)',
  },

  infoValue: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    color: '#1F1F1F',
  },

  profileInsight: {
    gap: 14,
  },

  profileBlock: {
    gap: 8,
  },

  profileLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.52)',
  },

  profileValue: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
    color: '#25745F',
  },

  compactList: {
    gap: 9,
  },

  compactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  compactMarker: {
    width: 6,
    height: 6,
    borderRadius: 99,
    marginTop: 8,
    backgroundColor: 'rgba(43,138,110,0.56)',
  },

  compactTextWrap: {
    flex: 1,
  },

  compactTitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#1F1F1F',
  },

  compactMeta: {
    marginTop: 1,
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(0,0,0,0.48)',
  },

  inlineMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 999,
    backgroundColor: 'rgba(31,31,31,0.06)',
  },

  inlineMoreText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.68)',
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  chip: {
    maxWidth: '100%',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  chipGreen: {
    backgroundColor: 'rgba(43,138,110,0.11)',
  },

  chipNeutral: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  chipMore: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  chipText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },

  chipTextGreen: {
    color: '#25745F',
  },

  chipTextNeutral: {
    color: 'rgba(0,0,0,0.93)',
  },

  groupList: {
    gap: 11,
  },

  groupCard: {
    gap: 10,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.07)',
  },

  skillList: {
    gap: 9,
  },

  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  skillMarker: {
    width: 6,
    height: 6,
    borderRadius: 99,
    marginTop: 8,
    backgroundColor: 'rgba(43,138,110,0.58)',
  },

  skillText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#1F1F1F',
  },

  groupTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: '#70635B',
  },

  relatedCard: {
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },

  relatedTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: '#1F1F1F',
  },

  relatedMeta: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(0,0,0,0.62)',
  },

  syncedAt: {
    marginTop: 12,
    marginHorizontal: 20,
    fontSize: 12,
    color: 'rgba(0,0,0,0.55)',
  },

  bottomActions: {
    marginTop: 18,
    marginHorizontal: 20,
  },

  backToBilanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: '#2B8A6E',
    shadowColor: '#2B8A6E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 2,
  },

  backToBilanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
