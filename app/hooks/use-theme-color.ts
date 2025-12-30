/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGender } from '@/contexts/gender-context';

type ThemeColorName = keyof typeof Colors.light & keyof typeof Colors.dark |
  'jarvisPrimary' | 'jarvisGlow' | 'jarvisCore' |
  'jarvisGradientStart' | 'jarvisGradientMiddle' | 'jarvisGradientEnd' |
  'successPrimary' | 'errorPrimary';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName
) {
  const theme = useColorScheme() ?? 'light';
  const { currentGender } = useGender();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Primero intentar colores específicos por género
    const genderColors = (Colors.gender[currentGender]?.[theme] as any)?.[colorName];
    if (genderColors) {
      return genderColors;
    }
    // Si no hay colores de género, usar colores base (solo para colores base)
    return Colors[theme][colorName as keyof typeof Colors.light];
  }
}
