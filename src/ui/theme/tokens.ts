import { TextStyle } from 'react-native';

export const colors = {
  // Canvas & Backgrounds
  canvas: '#000000',
  surface: 'rgba(16, 16, 18, 0.72)',
  surfaceSolid: '#121214',
  surfaceElevated: 'rgba(24, 24, 28, 0.88)',
  cardBg: '#18181B',
  
  // Borders & Dividers
  borderSubtle: 'rgba(255, 255, 255, 0.12)',
  borderHairline: 'rgba(255, 255, 255, 0.18)',
  borderFocus: '#F5C518',
  
  // Text & Icons
  textPrimary: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textInverse: '#09090B',
  
  // Hardware Accents (Strict Mandate)
  accent: '#F5C518', // Kodak Amber
  accentMuted: 'rgba(245, 197, 24, 0.16)',
  destructive: '#FF3B30', // Voice live recording & destructive actions
  destructiveMuted: 'rgba(255, 59, 48, 0.18)',
  success: '#34C759',
  
  // Overlays
  scrim: 'rgba(0, 0, 0, 0.55)',
  shutterFlash: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  tabularNums: {
    fontVariant: ['tabular-nums'],
  } as TextStyle,
  labelTiny: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,
  labelSm: {
    fontSize: 12,
    fontWeight: '500',
  } as TextStyle,
  body: {
    fontSize: 14,
    fontWeight: '400',
  } as TextStyle,
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500',
  } as TextStyle,
  headingSm: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,
  headingMd: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  } as TextStyle,
  monoMetric: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.2,
  } as TextStyle,
} as const;

export const zIndex = {
  camera: 0,
  grid: 5,
  reticle: 10,
  controls: 20,
  floatingPill: 30,
  tray: 40,
  modal: 50,
  toast: 100,
} as const;
