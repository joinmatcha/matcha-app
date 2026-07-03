import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import Colors from '@/themes/colors';
import { titleFontFamily } from '@/themes/typography';

type MatchaButtonVariant = 'primary' | 'light' | 'danger' | 'disabled';
type IconName = keyof typeof MaterialIcons.glyphMap;

type Props = {
  label: string;
  onPress?: () => void;
  variant?: MatchaButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
};

export default function MatchaButton({
  label,
  onPress,
  variant = 'light',
  icon = 'arrow-forward',
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}: Props) {
  const inactive = disabled || loading;
  const visualVariant = inactive ? 'disabled' : variant;
  const colors = variantColors[visualVariant];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={inactive ? 1 : 0.86}
      disabled={inactive}
      onPress={onPress}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        { backgroundColor: colors.background },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <MaterialIcons
            name={disabled ? 'lock-outline' : icon}
            size={16}
            color={colors.text}
          />
        </>
      )}
    </TouchableOpacity>
  );
}

const variantColors: Record<
  MatchaButtonVariant,
  { background: string; text: string }
> = {
  primary: {
    background: '#00513A',
    text: '#FFFFFF',
  },
  light: {
    background: '#FFFFFF',
    text: Colors.text.strong,
  },
  danger: {
    background: '#F8E4E3',
    text: '#B30000',
  },
  disabled: {
    background: 'rgba(255,255,255,0.62)',
    text: '#6E7772',
  },
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  fullWidth: {
    alignSelf: 'stretch',
    minHeight: 50,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: titleFontFamily,
  },
});
