import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActiveTray, useCameraSessionStore } from '../store/useCameraSessionStore';
import { colors, radius, spacing, typography } from '../../../ui/theme/tokens';
import { hapticTap } from '../../../ui/theme/haptics';

interface TabItem {
  id: ActiveTray;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'scenes', label: 'Scenes' },
  { id: 'look', label: 'Look' },
  { id: 'adjust', label: 'Adjust' },
];

export const ModeTabs: React.FC = () => {
  const activeTray = useCameraSessionStore((s) => s.activeTray);
  const toggleActiveTray = useCameraSessionStore((s) => s.toggleActiveTray);

  const handleTabPress = (id: ActiveTray) => {
    hapticTap();
    toggleActiveTray(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pillTrack}>
        {TABS.map((tab) => {
          const isActive = activeTray === tab.id;
          return (
            <Pressable
              key={tab.id}
              hitSlop={6}
              onPress={() => handleTabPress(tab.id)}
              style={[styles.tab, isActive && styles.tabActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} Tray`}
            >
              {isActive && <View style={styles.activeDot} />}
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
  },
  pillTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 20, 0.78)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    borderRadius: radius.pill,
    padding: 3,
    gap: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
  tabText: {
    ...typography.labelSm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
