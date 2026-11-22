import { create } from 'zustand';

export type AspectRatio = '9:16' | '4:5' | '1:1';
export type FlashMode = 'off' | 'on' | 'auto';
export type CameraPosition = 'front' | 'back';
export type ActiveTray = 'none' | 'scenes' | 'look' | 'adjust';

interface CameraSessionState {
  // Optics & Hardware
  cameraPosition: CameraPosition;
  flashMode: FlashMode;
  aspectRatio: AspectRatio;
  
  // Tray & Presets
  activeTray: ActiveTray;
  selectedSceneId: string;
  selectedLookId: string;
  
  // Session & Studio
  watermarkEnabled: boolean;
  lastCapturedUri: string | null;
  toastMessage: string | null;
  
  // Status & Modals
  isOnline: boolean;
  isSettingsOpen: boolean;
  isWatermarkSheetOpen: boolean;
  isVoiceActive: boolean;
  voiceTranscript: string | null;
  
  // Preferences
  gridLinesEnabled: boolean;
  hapticsEnabled: boolean;

  // Actions
  toggleFlash: () => void;
  cycleAspectRatio: () => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setActiveTray: (tray: ActiveTray) => void;
  toggleActiveTray: (tray: ActiveTray) => void;
  selectScene: (id: string) => void;
  selectLook: (id: string) => void;
  flipCamera: () => void;
  setCameraPosition: (pos: CameraPosition) => void;
  setLastCapturedUri: (uri: string | null) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  setSettingsOpen: (open: boolean) => void;
  setWatermarkSheetOpen: (open: boolean) => void;
  toggleWatermark: () => void;
  setWatermarkEnabled: (enabled: boolean) => void;
  setVoiceActive: (active: boolean) => void;
  setVoiceTranscript: (transcript: string | null) => void;
  setOnline: (online: boolean) => void;
  toggleGridLines: () => void;
  toggleHaptics: () => void;
}

export const useCameraSessionStore = create<CameraSessionState>((set) => ({
  cameraPosition: 'back',
  flashMode: 'off',
  aspectRatio: '9:16',
  activeTray: 'none',
  selectedSceneId: 'off',
  selectedLookId: 'natural',
  watermarkEnabled: true,
  lastCapturedUri: null,
  toastMessage: null,
  isOnline: true,
  isSettingsOpen: false,
  isWatermarkSheetOpen: false,
  isVoiceActive: false,
  voiceTranscript: null,
  gridLinesEnabled: false,
  hapticsEnabled: true,

  toggleFlash: () =>
    set((state) => {
      const next: FlashMode =
        state.flashMode === 'off' ? 'on' : state.flashMode === 'on' ? 'auto' : 'off';
      return { flashMode: next };
    }),

  cycleAspectRatio: () =>
    set((state) => {
      const next: AspectRatio =
        state.aspectRatio === '9:16' ? '4:5' : state.aspectRatio === '4:5' ? '1:1' : '9:16';
      return { aspectRatio: next };
    }),

  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),

  setActiveTray: (tray) => set({ activeTray: tray }),

  toggleActiveTray: (tray) =>
    set((state) => ({ activeTray: state.activeTray === tray ? 'none' : tray })),

  selectScene: (id) => set({ selectedSceneId: id }),

  selectLook: (id) => set({ selectedLookId: id }),

  flipCamera: () =>
    set((state) => ({
      cameraPosition: state.cameraPosition === 'back' ? 'front' : 'back',
    })),

  setCameraPosition: (pos) => set({ cameraPosition: pos }),

  setLastCapturedUri: (uri) => set({ lastCapturedUri: uri }),

  showToast: (message) => set({ toastMessage: message }),

  clearToast: () => set({ toastMessage: null }),

  setSettingsOpen: (open) => set({ isSettingsOpen: open }),

  setWatermarkSheetOpen: (open) => set({ isWatermarkSheetOpen: open }),

  toggleWatermark: () =>
    set((state) => ({ watermarkEnabled: !state.watermarkEnabled })),

  setWatermarkEnabled: (enabled) => set({ watermarkEnabled: enabled }),

  setVoiceActive: (active) => set({ isVoiceActive: active }),

  setVoiceTranscript: (transcript) => set({ voiceTranscript: transcript }),

  setOnline: (online) => set({ isOnline: online }),

  toggleGridLines: () =>
    set((state) => ({ gridLinesEnabled: !state.gridLinesEnabled })),

  toggleHaptics: () =>
    set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
}));
