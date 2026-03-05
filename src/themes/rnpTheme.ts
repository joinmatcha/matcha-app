import { DefaultTheme } from 'react-native-paper';

import borderRadius from '@/themes/borderRadius';
import colors from '@/themes/colors';
import fontSize from '@/themes/fontSize';
import fonts from '@/themes/fonts';
import spacing from '@/themes/spacing';

const rnpTheme = {
  ...DefaultTheme,
  colors: colors,
  // Paper v5 (MD3) n'expose plus regular/medium/light/thin sur fonts.
  // On conserve la typescale par défaut et on pilote les polices via nos styles.
  fonts: DefaultTheme.fonts,
  customFonts: fonts,
  fontSize: fontSize,
  spacing: spacing,
  borderRadius: borderRadius,
};

export default rnpTheme;
