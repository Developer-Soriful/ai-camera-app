import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Mic, Radio, Sparkles } from 'lucide-react-native';
import { useCameraSessionStore } from '../../camera/store/useCameraSessionStore';
import { colors, radius, spacing, typography, zIndex } from '../../../ui/theme/tokens';
import { SPRING_SNAPPY } from '../../../ui/theme/motion';
import { hapticTap, hapticTick, hapticWarning } from '../../../ui/theme/haptics';

const HINTS = [
  'Say a scene...',
  'বলো: পেছনে বৃষ্টির রাত',
  'Try: Warm 90s film',
  'বলো: ব্যাকগ্রাউন্ড ব্লার করো',
  'Try: Dark editorial studio',
];

export const VoiceCommandPill: React.FC = () => {
  const isOnline = useCameraSessionStore((s) => s.isOnline);
  const isVoiceActive = useCameraSessionStore((s) => s.isVoiceActive);
  const setVoiceActive = useCameraSessionStore((s) => s.setVoiceActive);
  const selectScene = useCameraSessionStore((s) => s.selectScene);
  const showToast = useCameraSessionStore((s) => s.showToast);

  const [hintIndex, setHintIndex] = useState(0);
  const [voiceStage, setVoiceStage] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [transcript, setTranscript] = useState('');

  // Reanimated Waveform Shared Values (5 bars)
  const bar1 = useSharedValue(6);
  const bar2 = useSharedValue(12);
  const bar3 = useSharedValue(18);
  const bar4 = useSharedValue(10);
  const bar5 = useSharedValue(7);
  const pulseScale = useSharedValue(1);

  // Cycling Hints
  useEffect(() => {
    if (voiceStage !== 'idle') return;
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % HINTS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [voiceStage]);

  // Waveform Bar Animation loop when listening
  useEffect(() => {
    if (voiceStage === 'listening') {
      const animateBar = (val: any, minH: number, maxH: number, dur: number) => {
        val.value = withRepeat(
          withSequence(
            withTiming(maxH, { duration: dur }),
            withTiming(minH, { duration: dur * 0.85 })
          ),
          -1,
          true
        );
      };
      animateBar(bar1, 4, 18, 160);
      animateBar(bar2, 6, 26, 220);
      animateBar(bar3, 8, 30, 180);
      animateBar(bar4, 5, 22, 240);
      animateBar(bar5, 4, 16, 200);

      pulseScale.value = withRepeat(
        withSequence(withTiming(1.3, { duration: 300 }), withTiming(1, { duration: 300 })),
        -1,
        true
      );
    } else {
      bar1.value = withTiming(6);
      bar2.value = withTiming(10);
      bar3.value = withTiming(14);
      bar4.value = withTiming(8);
      bar5.value = withTiming(6);
      pulseScale.value = withTiming(1);
    }
  }, [voiceStage, bar1, bar2, bar3, bar4, bar5, pulseScale]);

  const b1Style = useAnimatedStyle(() => ({ height: bar1.value }));
  const b2Style = useAnimatedStyle(() => ({ height: bar2.value }));
  const b3Style = useAnimatedStyle(() => ({ height: bar3.value }));
  const b4Style = useAnimatedStyle(() => ({ height: bar4.value }));
  const b5Style = useAnimatedStyle(() => ({ height: bar5.value }));
  const dotStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }] }));

  const startListening = () => {
    hapticTap();
    setVoiceActive(true);
    setVoiceStage('listening');
    setTranscript('Listening...');

    // Simulate speech-recognition progress
    setTimeout(() => {
      if (isOnline) {
        setTranscript('“পেছনে বৃষ্টির রাত আর নিয়ন লাইট”');
        setVoiceStage('processing');

        setTimeout(() => {
          selectScene('rainy-night');
          showToast('Scene applied: Rainy Night');
          setVoiceStage('idle');
          setVoiceActive(false);
          setTranscript('');
        }, 1800);
      } else {
        setTranscript('“Local shortcut: Optical Blur”');
        setTimeout(() => {
          selectScene('soft-blur');
          showToast('Offline Scene: Soft Blur');
          setVoiceStage('idle');
          setVoiceActive(false);
          setTranscript('');
        }, 1200);
      }
    }, 2200);
  };

  const cancelListening = () => {
    hapticWarning();
    setVoiceStage('idle');
    setVoiceActive(false);
    setTranscript('');
  };

  return (
    <View style={styles.container}>
      {voiceStage === 'idle' ? (
        <Pressable
          hitSlop={8}
          onPress={startListening}
          style={styles.idlePill}
          accessibilityRole="button"
          accessibilityLabel="Activate Voice Directives"
        >
          <View style={styles.micCircle}>
            <Mic size={14} color={colors.accent} strokeWidth={2} />
          </View>
          <Text style={styles.hintText}>{HINTS[hintIndex]}</Text>
          {!isOnline && (
            <View style={styles.offlineTag}>
              <Text style={styles.offlineText}>OFFLINE</Text>
            </View>
          )}
        </Pressable>
      ) : (
        <Pressable
          hitSlop={8}
          onPress={cancelListening}
          style={[styles.activePill, voiceStage === 'processing' && styles.processingPill]}
          accessibilityRole="button"
          accessibilityLabel="Cancel Voice Directive"
        >
          {voiceStage === 'listening' ? (
            <View style={styles.listeningRow}>
              <Animated.View style={[styles.recordingDot, dotStyle]} />
              {/* Waveform */}
              <View style={styles.waveformContainer}>
                <Animated.View style={[styles.bar, b1Style]} />
                <Animated.View style={[styles.bar, b2Style]} />
                <Animated.View style={[styles.bar, b3Style]} />
                <Animated.View style={[styles.bar, b4Style]} />
                <Animated.View style={[styles.bar, b5Style]} />
              </View>
              <Text numberOfLines={1} style={styles.transcriptText}>
                {transcript}
              </Text>
            </View>
          ) : (
            <View style={styles.processingRow}>
              <Radio size={14} color={colors.accent} strokeWidth={2} />
              <Text numberOfLines={1} style={styles.processingText}>
                Quick ad while we build your scene...
              </Text>
            </View>
          )}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
    zIndex: zIndex.floatingPill,
  },
  idlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 22, 0.78)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    gap: spacing.sm,
    maxWidth: '85%',
  },
  micCircle: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    ...typography.bodyMedium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  offlineTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  offlineText: {
    ...typography.labelTiny,
    fontSize: 8,
    color: colors.textSecondary,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 24, 0.94)',
    borderWidth: 1,
    borderColor: colors.destructive,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    maxWidth: '92%',
  },
  processingPill: {
    borderColor: colors.borderFocus,
  },
  listeningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.destructive,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 28,
  },
  bar: {
    width: 3,
    backgroundColor: colors.textPrimary,
    borderRadius: 1.5,
  },
  transcriptText: {
    ...typography.bodyMedium,
    fontSize: 12,
    color: colors.textPrimary,
    maxWidth: 180,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  processingText: {
    ...typography.bodyMedium,
    fontSize: 12,
    color: colors.accent,
  },
});
