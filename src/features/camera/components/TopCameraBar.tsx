import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings2, Zap, ZapOff } from 'lucide-react-native';
import { useCameraSessionStore } from '../store/useCameraSessionStore';
import { colors, radius, spacing, typography, zIndex } from '../../../ui/theme/tokens';
import { hapticTap } from '../../../ui/theme/haptics';

export const TopCameraBar: React.FC = () => {
  const insets = useSafeAreaInsets();

  const flashMode = useCameraSessionStore((s) => s.flashMode);
  const aspectRatio = useCameraSessionStore((s) => s.aspectRatio);
  const isOnline = useCameraSessionStore((s) => s.isOnline);
  const toggleFlash = useCameraSessionStore((s) => s.toggleFlash);
  const cycleAspectRatio = useCameraSessionStore((s) => s.cycleAspectRatio);
  const setSettingsOpen = useCameraSessionStore((s) => s.setSettingsOpen);
  const showToast = useCameraSessionStore((s) => s.showToast);

  const handleOfflinePress = () => {
    hapticTap();
    showToast(isOnline ? 'Online · Cloud AI Active' : 'Offline · Basic camera ready');
  };

  const handleSettingsPress = () => {
    hapticTap();
    setSettingsOpen(true);
  };

  return (
    <View style={[styles.container, { top: insets.top + spacing.xs }]}>
      {/* Flash Pill */}
      <Pressable
        hitSlop={8}
        onPress={() => {
          hapticTap();
          toggleFlash();
        }}
        style={[styles.pill, flashMode !== 'off' && styles.pillActive]}
        accessibilityRole="button"
        accessibilityLabel={`Flash: ${flashMode}`}
      >
        {flashMode === 'off' ? (
          <ZapOff size={15} color={colors.textSecondary} strokeWidth={1.75} />
        ) : (
          <Zap size={15} color={colors.accent} strokeWidth={1.75} />
        )}
        <Text style={[styles.pillText, flashMode !== 'off' && styles.pillTextActive]}>
          {flashMode.toUpperCase()}
        </Text>
      </Pressable>

      {/* Center Group: Ratio & Network Status */}
      <View style={styles.centerGroup}>
        {/* Aspect Ratio Pill */}
        <Pressable
          hitSlop={8}
          onPress={() => {
            hapticTap();
            cycleAspectRatio();
          }}
          style={styles.pill}
          accessibilityRole="button"
          accessibilityLabel={`Ratio: ${aspectRatio}`}
        >
          <Text style={styles.pillText}>{aspectRatio}</Text>
        </Pressable>

        {/* Offline Status Dot */}
        <Pressable
          hitSlop={12}
          onPress={handleOfflinePress}
          style={styles.dotContainer}
          accessibilityRole="button"
          accessibilityLabel={isOnline ? 'Online status' : 'Offline status'}
        >
          <View
            style={[
              styles.networkDot,
              { backgroundColor: isOnline ? colors.success : colors.textMuted },
            ]}
          />
        </Pressable>
      </View>

      {/* Settings Button */}
      <Pressable
        hitSlop={10}
        onPress={handleSettingsPress}
        style={styles.iconPill}
        accessibilityRole="button"
        accessibilityLabel="Camera Settings"
      >
        <Settings2 size={16} color={colors.textSecondary} strokeWidth={1.75} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: zIndex.controls,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 34,
  },
  pillActive: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.accentMuted,
  },
  pillText: {
    ...typography.monoMetric,
    fontSize: 12,
    color: colors.textPrimary,
  },
  pillTextActive: {
    color: colors.accent,
  },
  centerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dotContainer: {
    width: 24,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  iconPill: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
