import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ADJUSTMENT_CONFIGS,
  AdjustmentKey,
  useAdjustmentValues,
} from '../context/AdjustmentContext';
import { TactileRulerSlider } from '../../../ui/primitives/TactileRulerSlider';
import { colors, radius, spacing, typography } from '../../../ui/theme/tokens';
import { hapticTap } from '../../../ui/theme/haptics';

const ATTRIBUTES: AdjustmentKey[] = ['blur', 'exposure', 'warmth', 'contrast', 'grain'];

export const AdjustTray: React.FC = () => {
  const [activeKey, setActiveKey] = useState<AdjustmentKey>('blur');
  const { getSharedValue } = useAdjustmentValues();

  const handleSelectKey = (key: AdjustmentKey) => {
    hapticTap();
    setActiveKey(key);
  };

  const activeConfig = ADJUSTMENT_CONFIGS[activeKey];
  const activeSharedValue = getSharedValue(activeKey);

  return (
    <View style={styles.container}>
      {/* Top Selector Row */}
      <View style={styles.selectorRow}>
        {ATTRIBUTES.map((key) => {
          const isSelected = key === activeKey;
          const config = ADJUSTMENT_CONFIGS[key];
          return (
            <Pressable
              key={key}
              hitSlop={6}
              onPress={() => handleSelectKey(key)}
              style={[styles.itemBtn, isSelected && styles.itemBtnActive]}
              accessibilityRole="button"
              accessibilityLabel={`Adjust ${config.label}`}
            >
              <Text
                style={[
                  styles.itemText,
                  isSelected && styles.itemTextActive,
                ]}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Tactile Ruler Scrubber */}
      <View style={styles.sliderWrapper}>
        <TactileRulerSlider
          key={activeKey}
          value={activeSharedValue}
          min={activeConfig.min}
          max={activeConfig.max}
          step={activeConfig.step}
          defaultValue={activeConfig.defaultValue}
          label={activeConfig.label}
          unit={activeConfig.unit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(12, 12, 14, 0.88)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  itemBtn: {
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  itemBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  itemText: {
    ...typography.labelTiny,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  itemTextActive: {
    color: colors.accent,
  },
  sliderWrapper: {
    paddingTop: 2,
  },
});
