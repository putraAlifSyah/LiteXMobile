/**
 * 8px grid spacing system.
 * Every spatial value is a multiple of 4 to stay on the grid.
 */
export const Spacing = {
  /** 2px  */ xxs: 2,
  /** 4px  */ xs: 4,
  /** 8px  */ sm: 8,
  /** 12px */ md: 12,
  /** 16px */ base: 16,
  /** 20px */ lg: 20,
  /** 24px */ xl: 24,
  /** 32px */ '2xl': 32,
  /** 40px */ '3xl': 40,
  /** 48px */ '4xl': 48,
  /** 56px */ '5xl': 56,
  /** 64px */ '6xl': 64,
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 40,
} as const;

export const HitSlop = {
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;
