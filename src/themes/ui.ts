import { TextStyle, ViewStyle } from 'react-native';

import Colors from '@/themes/colors';
import { fontWeightSemibold, titleFontFamily } from '@/themes/typography';

export const cardSurface: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 22,
  shadowColor: '#0D1520',
  shadowOpacity: 0.07,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 8 },
  elevation: 2,
};

export const mutedCardSurface: ViewStyle = {
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 20,
};

export const secondaryButton: ViewStyle = {
  backgroundColor: Colors.ui.surfaceMuted,
  minHeight: 48,
  paddingVertical: 11,
  borderRadius: 16,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#1B2735',
  shadowOpacity: 0.14,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
};

export const secondaryButtonText: TextStyle = {
  color: Colors.text.strong,
  fontSize: 15,
  fontWeight: fontWeightSemibold,
  fontFamily: titleFontFamily,
};

export const primaryButton: ViewStyle = {
  backgroundColor: Colors.accent.primary,
  borderRadius: 16,
  minHeight: 50,
  paddingVertical: 13,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#1A5C45',
  shadowOpacity: 0.2,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export const primaryButtonText: TextStyle = {
  color: Colors.text.inverse,
  fontSize: 16,
  fontWeight: fontWeightSemibold,
  fontFamily: titleFontFamily,
};

export const softBadge: ViewStyle = {
  backgroundColor: Colors.accent.soft,
  borderRadius: 14,
  paddingHorizontal: 12,
  paddingVertical: 6,
};

export const softBadgeText: TextStyle = {
  fontSize: 12,
  fontWeight: fontWeightSemibold,
  color: Colors.accent.strong,
};

export const neutralBadge: ViewStyle = {
  backgroundColor: Colors.ui.surfaceSoft,
  borderRadius: 14,
  paddingHorizontal: 12,
  paddingVertical: 6,
};

export const neutralBadgeText: TextStyle = {
  fontSize: 12,
  fontWeight: fontWeightSemibold,
  color: Colors.text.base,
};
