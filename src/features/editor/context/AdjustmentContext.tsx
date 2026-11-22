import React, { createContext, useContext, useMemo } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

export type AdjustmentKey = 'blur' | 'exposure' | 'warmth' | 'contrast' | 'grain';

export interface AdjustmentSnapshot {
  blur: number;
  exposure: number;
  warmth: number;
  contrast: number;
  grain: number;
}

export interface AdjustmentConfig {
  key: AdjustmentKey;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export const ADJUSTMENT_CONFIGS: Record<AdjustmentKey, AdjustmentConfig> = {
  blur: { key: 'blur', label: 'BLUR', min: 0, max: 100, step: 2, defaultValue: 0, unit: '%' },
  exposure: { key: 'exposure', label: 'EXPOSURE', min: -100, max: 100, step: 2, defaultValue: 0, unit: '' },
  warmth: { key: 'warmth', label: 'WARMTH', min: -100, max: 100, step: 2, defaultValue: 0, unit: 'K' },
  contrast: { key: 'contrast', label: 'CONTRAST', min: -100, max: 100, step: 2, defaultValue: 0, unit: '' },
  grain: { key: 'grain', label: 'GRAIN', min: 0, max: 100, step: 5, defaultValue: 0, unit: '%' },
};

interface AdjustmentContextValue {
  blur: SharedValue<number>;
  exposure: SharedValue<number>;
  warmth: SharedValue<number>;
  contrast: SharedValue<number>;
  grain: SharedValue<number>;
  getSharedValue: (key: AdjustmentKey) => SharedValue<number>;
  resetAll: () => void;
  snapshotValues: () => AdjustmentSnapshot;
}

const AdjustmentContext = createContext<AdjustmentContextValue | null>(null);

export const AdjustmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const blur = useSharedValue(0);
  const exposure = useSharedValue(0);
  const warmth = useSharedValue(0);
  const contrast = useSharedValue(0);
  const grain = useSharedValue(0);

  const value = useMemo<AdjustmentContextValue>(() => {
    const getSharedValue = (key: AdjustmentKey): SharedValue<number> => {
      switch (key) {
        case 'blur':
          return blur;
        case 'exposure':
          return exposure;
        case 'warmth':
          return warmth;
        case 'contrast':
          return contrast;
        case 'grain':
          return grain;
      }
    };

    const resetAll = () => {
      blur.value = 0;
      exposure.value = 0;
      warmth.value = 0;
      contrast.value = 0;
      grain.value = 0;
    };

    const snapshotValues = (): AdjustmentSnapshot => ({
      blur: blur.value,
      exposure: exposure.value,
      warmth: warmth.value,
      contrast: contrast.value,
      grain: grain.value,
    });

    return {
      blur,
      exposure,
      warmth,
      contrast,
      grain,
      getSharedValue,
      resetAll,
      snapshotValues,
    };
  }, [blur, exposure, warmth, contrast, grain]);

  return (
    <AdjustmentContext.Provider value={value}>
      {children}
    </AdjustmentContext.Provider>
  );
};

export function useAdjustmentValues(): AdjustmentContextValue {
  const ctx = useContext(AdjustmentContext);
  if (!ctx) {
    throw new Error('useAdjustmentValues must be used within an AdjustmentProvider');
  }
  return ctx;
}
