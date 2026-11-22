import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Database, Grid, Info, Sparkles, Trash2, Vibrate } from 'lucide-react-native';
import { SheetModal } from '../../../ui/primitives/SheetModal';
import { useCameraSessionStore } from '../../camera/store/useCameraSessionStore';
import { colors, radius, spacing, typography } from '../../../ui/theme/tokens';
import { hapticTap, hapticWarning } from '../../../ui/theme/haptics';

export const SettingsSheet: React.FC = () => {
  const isSettingsOpen = useCameraSessionStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useCameraSessionStore((s) => s.setSettingsOpen);
  const gridLinesEnabled = useCameraSessionStore((s) => s.gridLinesEnabled);
  const toggleGridLines = useCameraSessionStore((s) => s.toggleGridLines);
  const hapticsEnabled = useCameraSessionStore((s) => s.hapticsEnabled);
  const toggleHaptics = useCameraSessionStore((s) => s.toggleHaptics);
  const isOnline = useCameraSessionStore((s) => s.isOnline);
  const showToast = useCameraSessionStore((s) => s.showToast);

  const [cacheSize, setCacheSize] = useState('24.8 MB');

  const handleClearCache = () => {
    hapticWarning();
    setCacheSize('0.0 MB');
    showToast('Cached scenes cleared');
  };

  return (
    <SheetModal
      isOpen={isSettingsOpen}
      onClose={() => setSettingsOpen(false)}
      title="Settings"
    >
      <View style={styles.container}>
        {/* Composition Grid Toggle */}
        <View style={styles.row}>
          <View style={styles.iconLabelGroup}>
            <Grid size={18} color={colors.textSecondary} strokeWidth={1.75} />
            <View>
              <Text style={styles.rowTitle}>Rule of Thirds Grid</Text>
              <Text style={styles.rowSubtitle}>Viewfinder 3x3 framing overlay</Text>
            </View>
          </View>
          <Switch
            value={gridLinesEnabled}
            onValueChange={() => {
              hapticTap();
              toggleGridLines();
            }}
            trackColor={{ false: '#27272A', true: colors.accent }}
            thumbColor="#FAFAFA"
          />
        </View>

        {/* Haptics Feedback Toggle */}
        <View style={styles.row}>
          <View style={styles.iconLabelGroup}>
            <Vibrate size={18} color={colors.textSecondary} strokeWidth={1.75} />
            <View>
              <Text style={styles.rowTitle}>Tactile Haptics</Text>
              <Text style={styles.rowSubtitle}>Vibration ticks on shutter & sliders</Text>
            </View>
          </View>
          <Switch
            value={hapticsEnabled}
            onValueChange={() => {
              hapticTap();
              toggleHaptics();
            }}
            trackColor={{ false: '#27272A', true: colors.accent }}
            thumbColor="#FAFAFA"
          />
        </View>

        {/* Cache Storage Section */}
        <View style={styles.row}>
          <View style={styles.iconLabelGroup}>
            <Database size={18} color={colors.textSecondary} strokeWidth={1.75} />
            <View>
              <Text style={styles.rowTitle}>Scene Cache</Text>
              <Text style={styles.rowSubtitle}>{cacheSize} stored locally</Text>
            </View>
          </View>
          <Pressable
            hitSlop={8}
            onPress={handleClearCache}
            style={styles.clearBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear cached scenes"
          >
            <Trash2 size={13} color={colors.destructive} strokeWidth={1.75} />
            <Text style={styles.clearBtnText}>Clear</Text>
          </Pressable>
        </View>

        {/* Network & Engine Information */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Info size={14} color={colors.textMuted} strokeWidth={1.75} />
            <Text style={styles.infoText}>
              Engine: {isOnline ? 'Cloud AI Ready' : 'Offline Fallback Active'}
            </Text>
          </View>
          <Text style={styles.versionText}>VisionZ Mobile v1.0.0 (Build 1) · Production</Text>
        </View>
      </View>
    </SheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.base,
    gap: spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  iconLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  rowTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  rowSubtitle: {
    ...typography.labelTiny,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.destructiveMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.destructive,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  clearBtnText: {
    ...typography.labelTiny,
    fontSize: 10,
    color: colors.destructive,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#18181B',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    ...typography.labelTiny,
    fontSize: 11,
    color: colors.textSecondary,
  },
  versionText: {
    ...typography.labelTiny,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
