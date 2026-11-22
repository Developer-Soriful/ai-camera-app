import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { FocusReticle } from './FocusReticle';
import { useCameraSessionStore } from '../store/useCameraSessionStore';
import { LOOK_PRESETS } from '../../backgrounds/data/presets';
import { colors, radius, spacing, typography, zIndex } from '../../../ui/theme/tokens';
import { hapticTap, hapticTick } from '../../../ui/theme/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CameraViewportSlotProps {
  children?: React.ReactNode;
}

export const CameraViewportSlot: React.FC<CameraViewportSlotProps> = ({ children }) => {
  const [reticle, setReticle] = useState<{ x: number; y: number; id: number } | null>(null);

  const aspectRatio = useCameraSessionStore((s) => s.aspectRatio);
  const selectedLookId = useCameraSessionStore((s) => s.selectedLookId);
  const selectedSceneId = useCameraSessionStore((s) => s.selectedSceneId);
  const gridLinesEnabled = useCameraSessionStore((s) => s.gridLinesEnabled);
  const cameraPosition = useCameraSessionStore((s) => s.cameraPosition);
  const flipCamera = useCameraSessionStore((s) => s.flipCamera);
  const selectLook = useCameraSessionStore((s) => s.selectLook);
  const showToast = useCameraSessionStore((s) => s.showToast);

  const handleFocus = (x: number, y: number) => {
    hapticTap();
    setReticle({ x, y, id: Date.now() });
  };

  const handleFlip = () => {
    hapticTap();
    flipCamera();
  };

  const cycleLook = (direction: 'next' | 'prev') => {
    const currentIndex = LOOK_PRESETS.findIndex((l) => l.id === selectedLookId);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= LOOK_PRESETS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = LOOK_PRESETS.length - 1;
    const nextLook = LOOK_PRESETS[nextIndex];
    selectLook(nextLook.id);
    showToast(`Look: ${nextLook.name}`);
    hapticTick();
  };

  // Gestures
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd((e) => {
      runOnJS(handleFocus)(e.x, e.y);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleFlip)();
    });

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-25, 25])
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 40 && Math.abs(e.velocityY) < 800) {
        if (e.translationX < 0) {
          runOnJS(cycleLook)('next');
        } else {
          runOnJS(cycleLook)('prev');
        }
      }
    });

  const taps = Gesture.Exclusive(doubleTap, singleTap);
  const combinedGesture = Gesture.Simultaneous(taps, swipeGesture);

  const ratioNumeric = aspectRatio === '9:16' ? 9 / 16 : aspectRatio === '4:5' ? 4 / 5 : 1;
  const viewportHeight = SCREEN_WIDTH / ratioNumeric;

  const currentLook = LOOK_PRESETS.find((l) => l.id === selectedLookId);

  return (
    <View style={styles.outerContainer}>
      <GestureDetector gesture={combinedGesture}>
        <View style={[styles.viewportFrame, { height: viewportHeight }]}>
          {/* ========================================================
              PLUG-IN: VisionCamera + Skia Surface (Future Hook)
              ======================================================== */}
          {children ? (
            children
          ) : (
            <View style={styles.mockFeed}>
              <View style={styles.hardwareBadge}>
                <Text style={styles.badgeText}>
                  {cameraPosition.toUpperCase()} · {currentLook?.name}
                </Text>
              </View>
              {selectedSceneId !== 'off' && (
                <View style={styles.sceneBadge}>
                  <View style={styles.sceneDot} />
                  <Text style={styles.sceneText}>Scene: {selectedSceneId}</Text>
                </View>
              )}
            </View>
          )}

          {/* Rule of Thirds Grid Lines */}
          {gridLinesEnabled && (
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              <View style={[styles.gridLineV, { left: '33.33%' }]} />
              <View style={[styles.gridLineV, { left: '66.66%' }]} />
              <View style={[styles.gridLineH, { top: '33.33%' }]} />
              <View style={[styles.gridLineH, { top: '66.66%' }]} />
            </View>
          )}

          {/* Focus Reticle */}
          {reticle && (
            <FocusReticle key={reticle.id} x={reticle.x} y={reticle.y} visible={true} />
          )}
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
    overflow: 'hidden',
  },
  viewportFrame: {
    width: SCREEN_WIDTH,
    backgroundColor: '#0A0A0C',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockFeed: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D0D10',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  hardwareBadge: {
    backgroundColor: 'rgba(16, 16, 18, 0.75)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  sceneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 197, 24, 0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderFocus,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginTop: spacing.sm,
  },
  sceneDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
  sceneText: {
    ...typography.labelTiny,
    color: colors.accent,
    fontSize: 9,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
});
