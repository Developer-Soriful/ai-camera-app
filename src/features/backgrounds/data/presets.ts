export interface LookPreset {
  id: string;
  name: string;
  tagline: string;
  previewColor: string;
}

export interface ScenePreset {
  id: string;
  name: string;
  tagline: string;
  category: 'local' | 'cloud';
  isAdLocked: boolean;
  thumbnailGradient: [string, string];
}

export const LOOK_PRESETS: LookPreset[] = [
  { id: 'natural', name: 'Natural', tagline: 'Leica Neutral', previewColor: '#A1A1AA' },
  { id: 'y2k', name: 'Y2K', tagline: 'Cyber High-Key', previewColor: '#00F0FF' },
  { id: 'film90s', name: '90s Film', tagline: 'Halide Grain', previewColor: '#EAB308' },
  { id: 'warm', name: 'Warm', tagline: 'Golden Honey', previewColor: '#F97316' },
  { id: 'crisp', name: 'Crisp', tagline: 'Micro-Contrast', previewColor: '#FAFAFA' },
  { id: 'noir', name: 'Noir', tagline: 'Silver Gelatin', previewColor: '#27272A' },
  { id: 'studio', name: 'Studio', tagline: 'Editorial Soft', previewColor: '#93C5FD' },
];

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'off',
    name: 'Off',
    tagline: 'Direct Optical Lens',
    category: 'local',
    isAdLocked: false,
    thumbnailGradient: ['#18181B', '#09090B'],
  },
  {
    id: 'soft-blur',
    name: 'Soft Blur',
    tagline: 'f/1.4 Bokeh Optics',
    category: 'local',
    isAdLocked: false,
    thumbnailGradient: ['#27272A', '#18181B'],
  },
  {
    id: 'rainy-night',
    name: 'Rainy Night',
    tagline: 'Asphalt Reflection',
    category: 'cloud',
    isAdLocked: true,
    thumbnailGradient: ['#0C4A6E', '#0284C7'],
  },
  {
    id: 'studio-dark',
    name: 'Studio',
    tagline: 'Dark Cyclorama',
    category: 'local',
    isAdLocked: false,
    thumbnailGradient: ['#3F3F46', '#18181B'],
  },
  {
    id: 'kashful-sunset',
    name: 'Kashful',
    tagline: 'Autumn Golden Glow',
    category: 'cloud',
    isAdLocked: true,
    thumbnailGradient: ['#854D0E', '#EAB308'],
  },
  {
    id: 'warm-cafe',
    name: 'Warm Cafe',
    tagline: 'Ambient Bokeh',
    category: 'local',
    isAdLocked: false,
    thumbnailGradient: ['#78350F', '#B45309'],
  },
  {
    id: 'neon-street',
    name: 'Neon Street',
    tagline: 'Tokyo Night Rain',
    category: 'cloud',
    isAdLocked: true,
    thumbnailGradient: ['#831843', '#EC4899'],
  },
];
