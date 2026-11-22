import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../../ui/theme/tokens';
import { SPRING_RETICLE } from '../../../ui/theme/motion';

interface FocusReticleProps {
  x: number;
  y: number;
  visible: boolean;
}

export const FocusReticle: React.FC<FocusReticleProps> = ({ x, y, visible }) => {
  const scale = useSharedValue(1.35);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = 1.35;
      opacity.value = 1;
      scale.value = withSpring(1.0, SPRING_RETICLE);

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 250 });
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      opacity.value = 0;
    }
  }, [visible, x, y]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: x - 28 },
      { translateY: y - 28 },
      { scale: scale.value },
    ],
  }));

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.reticle, animatedStyle]}>
      {/* 4 Corner brackets */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
      {/* Center metering dot */}
      <View style={styles.centerDot} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  reticle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 56,
    height: 56,
  },
  corner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: colors.accent,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  centerDot: {
    position: 'absolute',
    top: 26,
    left: 26,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
