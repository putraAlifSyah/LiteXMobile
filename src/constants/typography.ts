import { TextStyle } from 'react-native';

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

export const FontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: 'PlayfairDisplay_800ExtraBold',
    fontSize: FontSizes['4xl'],
    lineHeight: FontSizes['4xl'] * LineHeights.tight,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSizes['3xl'],
    lineHeight: FontSizes['3xl'] * LineHeights.tight,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSizes['2xl'],
    lineHeight: FontSizes['2xl'] * LineHeights.tight,
  },
  h4: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: FontSizes.xl,
    lineHeight: FontSizes.xl * LineHeights.normal,
  },
  h5: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: FontSizes.lg,
    lineHeight: FontSizes.lg * LineHeights.normal,
  },
  subtitle1: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * LineHeights.normal,
  },
  subtitle2: {
    fontFamily: 'Inter_500Medium',
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * LineHeights.normal,
  },
  body1: {
    fontFamily: 'Inter_400Regular',
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * LineHeights.relaxed,
  },
  body2: {
    fontFamily: 'Inter_400Regular',
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * LineHeights.relaxed,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },
  overline: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * LineHeights.normal,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * LineHeights.normal,
    letterSpacing: 0.5,
  },
};
