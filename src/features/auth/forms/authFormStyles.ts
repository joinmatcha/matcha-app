import { StyleSheet } from 'react-native';

import Colors from '@/themes/colors';
import { bodyFontFamily } from '@/themes/typography';

export const authInputTheme = {
  colors: {
    primary: Colors.accent.primary,
    error: Colors.error,
    outline: 'rgba(0,81,58,0.12)',
    onSurfaceVariant: 'rgba(31,31,31,0.58)',
  },
};

export const authFormStyles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    gap: 8,
  },
  input: {
    backgroundColor: '#F7FAF8',
    fontFamily: bodyFontFamily,
    height: 54,
  },
  inputContent: {
    height: 54,
    fontFamily: bodyFontFamily,
    color: Colors.text.strong,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputOutline: {
    borderRadius: 8,
    borderWidth: 1,
  },
  helper: {
    marginTop: -8,
  },
  submitButton: {
    marginTop: 10,
  },
});
