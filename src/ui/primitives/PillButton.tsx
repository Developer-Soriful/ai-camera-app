import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { SPRING_SNAPPY } from '../theme/motion';
import { hapticTap } from '../theme/haptics';

interface PillButtonProps {
  label?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'normal' | 'accent' | 'destructive';
  hitSlop?: number;
  accessibilityLabel?: string;
}

export const PillButton: React.FC<PillButtonProps> = ({
  label,
  icon,
  isActive = false,
  onPress,
  style,
  variant = 'normal',
  hitSlop = 8,
  accessibilityLabel,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.93, SPRING_SNAPPY);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_SNAPPY);
  };

  const handlePress = () => {
    hapticTap();
    onPress();
  };

  const isAmber = isActive || variant === 'accent';
  const isDestructive = variant === 'destructive';

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        hitSlop={hitSlop}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole="button"
        style={[
          styles.pill,
          isAmber && styles.pillActive,
          isDestructive && styles.pillDestructive,
          style,
        ]}
      >
        {icon}
        {label ? (
          <Text
            style={[
              styles.label,
              isAmber && styles.labelActive,
              isDestructive && styles.labelDestructive,
            ]}
          >
            {label}
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 36,
    gap: spacing.xs,
  },
  pillActive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.borderFocus,
  },
  pillDestructive: {
    backgroundColor: colors.destructiveMuted,
    borderColor: colors.destructive,
  },
  label: {
    ...typography.labelSm,
    color: colors.textPrimary,
  },
  labelActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  labelDestructive: {
    color: colors.destructive,
    fontWeight: '600',
  },
});
