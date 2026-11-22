import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Play, Sparkles } from 'lucide-react-native';
import { SheetModal } from '../../../ui/primitives/SheetModal';
import { useCameraSessionStore } from '../../camera/store/useCameraSessionStore';
import { colors, radius, spacing, typography } from '../../../ui/theme/tokens';
import { hapticSuccess, hapticTap } from '../../../ui/theme/haptics';

export const WatermarkSheet: React.FC = () => {
  const isWatermarkSheetOpen = useCameraSessionStore((s) => s.isWatermarkSheetOpen);
  const setWatermarkSheetOpen = useCameraSessionStore((s) => s.setWatermarkSheetOpen);
  const setWatermarkEnabled = useCameraSessionStore((s) => s.setWatermarkEnabled);
  const showToast = useCameraSessionStore((s) => s.showToast);

  const handleWatchAd = () => {
    hapticTap();
    // ========================================================
    // PLUG-IN: AdMob Rewarded Video / Interstitial Hook
    // ========================================================
    setWatermarkEnabled(false);
    setWatermarkSheetOpen(false);
    hapticSuccess();
    showToast('Watermark removed for this session');
  };

  const handleKeepWatermark = () => {
    hapticTap();
    setWatermarkSheetOpen(false);
  };

  return (
    <SheetModal
      isOpen={isWatermarkSheetOpen}
      onClose={() => setWatermarkSheetOpen(false)}
      title="Remove Watermark"
    >
      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.amberBadge}>
            <Text style={styles.badgeLabel}>FREE REWARD</Text>
          </View>
        </View>

        <Text style={styles.headline}>Export clean without watermark</Text>
        <Text style={styles.subtext}>
          Watch a quick sponsored message to export this photo without the subtle “Shot on VisionZ” corner emblem.
        </Text>

        <View style={styles.actions}>
          <Pressable
            hitSlop={8}
            onPress={handleWatchAd}
            style={styles.primaryBtn}
            accessibilityRole="button"
            accessibilityLabel="Watch Short Ad to Remove Watermark"
          >
            <Play size={15} color={colors.textInverse} fill={colors.textInverse} />
            <Text style={styles.primaryBtnText}>Watch Short Ad (Remove)</Text>
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={handleKeepWatermark}
            style={styles.secondaryBtn}
            accessibilityRole="button"
            accessibilityLabel="Keep Watermark"
          >
            <Text style={styles.secondaryBtnText}>Keep Watermark</Text>
          </Pressable>
        </View>
      </View>
    </SheetModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.base,
    gap: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  amberBadge: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderFocus,
  },
  badgeLabel: {
    ...typography.labelTiny,
    fontSize: 9,
    color: colors.accent,
  },
  headline: {
    ...typography.headingSm,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  subtext: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.base,
  },
  actions: {
    gap: spacing.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.textPrimary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
  },
  primaryBtnText: {
    ...typography.bodyMedium,
    color: colors.textInverse,
    fontWeight: '600',
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  secondaryBtnText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
});
