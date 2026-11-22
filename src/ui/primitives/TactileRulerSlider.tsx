import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TextInput } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { SPRING_SNAPPY } from '../theme/motion';
import { hapticTap, hapticTick } from '../theme/haptics';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface TactileRulerSliderProps {
  value: SharedValue<number>;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  label?: string;
  unit?: string;
}

const TICK_SPACING = 8;
const TICKS_COUNT = 60;

export const TactileRulerSlider: React.FC<TactileRulerSliderProps> = ({
  value,
  min = -100,
  max = 100,
  step = 1,
  defaultValue = 0,
  label,
  unit = '',
}) => {
  const startVal = useSharedValue(0);
  const lastStepIndex = useSharedValue(Math.round(value.value / step));

  const triggerTick = () => {
    'worklet';
    runOnJS(hapticTick)();
  };

  const triggerResetHaptic = () => {
    'worklet';
    runOnJS(hapticTap)();
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startVal.value = value.value;
      lastStepIndex.value = Math.round(value.value / step);
    })
    .onUpdate((e) => {
      // 1 pixel = (range / 300) units for tactile sensitivity
      const range = max - min;
      const sensitivity = range / 240;
      const raw = startVal.value + e.translationX * sensitivity;
      const clamped = Math.max(min, Math.min(max, raw));
      const stepped = Math.round(clamped / step) * step;

      const currentStep = Math.round(stepped / step);
      if (currentStep !== lastStepIndex.value) {
        lastStepIndex.value = currentStep;
        triggerTick();
      }
      value.value = stepped;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      value.value = withSpring(defaultValue, SPRING_SNAPPY);
      triggerResetHaptic();
    });

  const composedGesture = Gesture.Race(doubleTapGesture, panGesture);

  // Live tabular readout via animated props (zero React re-render)
  const animatedTextProps = useAnimatedProps(() => {
    const val = Math.round(value.value);
    const sign = val > 0 ? '+' : '';
    return {
      text: `${sign}${val}${unit}`,
      value: `${sign}${val}${unit}`,
    } as any;
  });

  // Animated ruler offset
  const rulerStyle = useAnimatedStyle(() => {
    const range = max - min;
    const progress = (value.value - min) / (range || 1) - 0.5;
    const offset = -progress * (TICKS_COUNT * TICK_SPACING);
    return {
      transform: [{ translateX: offset }],
    };
  });

  const ticks = useMemo(() => Array.from({ length: TICKS_COUNT }), []);

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={styles.container}>
        <View style={styles.header}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          <AnimatedTextInput
            underlineColorAndroid="transparent"
            editable={false}
            animatedProps={animatedTextProps}
            style={styles.valueReadout}
          />
        </View>

        <View style={styles.rulerViewport}>
          {/* Moving Tick Marks */}
          <Animated.View style={[styles.ticksRow, rulerStyle]}>
            {ticks.map((_, i) => {
              const isMajor = i % 5 === 0;
              const isCenter = i === TICKS_COUNT / 2;
              return (
                <View
                  key={i}
                  style={[
                    styles.tick,
                    isMajor && styles.tickMajor,
                    isCenter && styles.tickCenter,
                  ]}
                />
              );
            })}
          </Animated.View>

          {/* Center Kodak Amber Needle */}
          <View pointerEvents="none" style={styles.needleWrapper}>
            <View style={styles.needle} />
            <View style={styles.needleDot} />
          </View>
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.labelTiny,
    color: colors.textSecondary,
  },
  valueReadout: {
    ...typography.monoMetric,
    color: colors.accent,
    padding: 0,
    margin: 0,
    textAlign: 'right',
  },
  rulerViewport: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ticksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TICK_SPACING - 1,
  },
  tick: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  tickMajor: {
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  tickCenter: {
    height: 22,
    backgroundColor: colors.textPrimary,
  },
  needleWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needle: {
    width: 2,
    height: 28,
    backgroundColor: colors.accent,
    borderRadius: radius.xs,
  },
  needleDot: {
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    marginTop: 2,
  },
});
