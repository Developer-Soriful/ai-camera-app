import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography, zIndex } from '../theme/tokens';
import { SPRING_SNAPPY } from '../theme/motion';

interface ToastPillProps {
  message: string | null;
  onDismiss?: () => void;
  duration?: number;
}

export const ToastPill: React.FC<ToastPillProps> = ({
  message,
  onDismiss,
  duration = 2600,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (message) {
      translateY.value = withSpring(0, SPRING_SNAPPY);
      opacity.value = withTiming(1, { duration: 180 });

      const timer = setTimeout(() => {
        translateY.value = withSpring(-60, SPRING_SNAPPY);
        opacity.value = withTiming(0, { duration: 200 }, () => {
          if (onDismiss) onDismiss();
        });
      }, duration);

      return () => clearTimeout(timer);
    } else {
      translateY.value = withSpring(-60, SPRING_SNAPPY);
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [message, duration, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!message) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.wrapper, { top: insets.top + spacing.sm }]}
    >
      <Animated.View style={[styles.pill, animatedStyle]}>
        <View style={styles.indicatorDot} />
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: zIndex.toast,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 24, 0.94)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  text: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontSize: 13,
  },
});
