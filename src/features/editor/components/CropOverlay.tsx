import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AspectRatio, useCameraSessionStore } from '../../camera/store/useCameraSessionStore';
import { colors, radius, spacing, typography } from '../../../ui/theme/tokens';
import { hapticTap } from '../../../ui/theme/haptics';

const RATIOS: AspectRatio[] = ['9:16', '4:5', '1:1'];

export const CropOverlay: React.FC = () => {
  const aspectRatio = useCameraSessionStore((s) => s.aspectRatio);
  const setAspectRatio = useCameraSessionStore((s) => s.setAspectRatio);

  const handleSelectRatio = (ratio: AspectRatio) => {
    hapticTap();
    setAspectRatio(ratio);
  };

  const handleReset = () => {
    hapticTap();
    setAspectRatio('9:16');
  };

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {/* Rule of Thirds Frame */}
      <View pointerEvents="none" style={styles.gridOverlay}>
        <View style={[styles.gridLineV, { left: '33.33%' }]} />
        <View style={[styles.gridLineV, { left: '66.66%' }]} />
        <View style={[styles.gridLineH, { top: '33.33%' }]} />
        <View style={[styles.gridLineH, { top: '66.66%' }]} />

        {/* 4 Corner Anchors */}
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
      </View>

      {/* Floating Ratio Selector Bar */}
      <View style={styles.ratioBar}>
        {RATIOS.map((r) => {
          const isSelected = r === aspectRatio;
          return (
            <Pressable
              key={r}
              hitSlop={6}
              onPress={() => handleSelectRatio(r)}
              style={[styles.ratioPill, isSelected && styles.ratioPillActive]}
              accessibilityRole="button"
              accessibilityLabel={`Aspect ratio ${r}`}
            >
              <Text style={[styles.ratioText, isSelected && styles.ratioTextActive]}>
                {r}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          hitSlop={6}
          onPress={handleReset}
          style={styles.resetBtn}
          accessibilityRole="button"
          accessibilityLabel="Reset aspect ratio"
        >
          <Text style={styles.resetText}>RESET</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    margin: spacing.sm,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: '#FFFFFF',
  },
  tl: { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 },
  ratioBar: {
    position: 'absolute',
    bottom: spacing.lg,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 16, 20, 0.88)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    borderRadius: radius.pill,
    padding: 3,
    gap: 4,
  },
  ratioPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  ratioPillActive: {
    backgroundColor: colors.accentMuted,
  },
  ratioText: {
    ...typography.monoMetric,
    fontSize: 12,
    color: colors.textSecondary,
  },
  ratioTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  resetBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  resetText: {
    ...typography.labelTiny,
    fontSize: 10,
    color: colors.textMuted,
  },
});
