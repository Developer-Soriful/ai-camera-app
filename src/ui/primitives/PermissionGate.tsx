import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, ShieldAlert } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { hapticTap } from '../theme/haptics';

interface PermissionGateProps {
  title?: string;
  subtitle?: string;
  onAllow?: () => void;
  onOpenSettings?: () => void;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  title = 'Camera access needed to shoot',
  subtitle = 'VisionZ requires camera and microphone permissions to capture scenes, adjust optics, and process voice directives.',
  onAllow,
  onOpenSettings,
}) => {
  const handleAllow = () => {
    hapticTap();
    if (onAllow) {
      onAllow();
    } else {
      Linking.openSettings().catch(() => {});
    }
  };

  const handleSettings = () => {
    hapticTap();
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      Linking.openSettings().catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconRing}>
        <View style={styles.iconInner}>
          <Camera size={32} color={colors.accent} strokeWidth={1.75} />
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryBtn}
          onPress={handleAllow}
          accessibilityRole="button"
          accessibilityLabel="Allow Camera"
        >
          <Text style={styles.primaryBtnText}>Allow Camera</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={handleSettings}
          accessibilityRole="button"
          accessibilityLabel="Open Settings"
        >
          <ShieldAlert size={16} color={colors.textSecondary} strokeWidth={1.75} />
          <Text style={styles.secondaryBtnText}>Open Settings</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(24, 24, 28, 0.6)',
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.3)',
  },
  title: {
    ...typography.headingMd,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xxl,
  },
  actions: {
    width: '100%',
    maxWidth: 280,
    gap: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.textPrimary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    ...typography.bodyMedium,
    color: colors.textInverse,
    fontWeight: '600',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
  },
  secondaryBtnText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
});
