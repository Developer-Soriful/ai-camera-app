import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { CameraViewportSlot } from '../features/camera/components/CameraViewportSlot';
import { TopCameraBar } from '../features/camera/components/TopCameraBar';
import { ModeTabs } from '../features/camera/components/ModeTabs';
import { ShutterDock } from '../features/camera/components/ShutterDock';
import { VoiceCommandPill } from '../features/voice/components/VoiceCommandPill';
import { SceneFilmstrip } from '../features/backgrounds/components/SceneFilmstrip';
import { LookFilmstrip } from '../features/editor/components/LookFilmstrip';
import { AdjustTray } from '../features/editor/components/AdjustTray';
import { SettingsSheet } from '../features/settings/components/SettingsSheet';
import { PermissionGate } from '../ui/primitives/PermissionGate';
import { useCameraSessionStore } from '../features/camera/store/useCameraSessionStore';
import { colors } from '../ui/theme/tokens';

export default function CameraScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(true);

  const activeTray = useCameraSessionStore((s) => s.activeTray);
  const setLastCapturedUri = useCameraSessionStore((s) => s.setLastCapturedUri);

  // Shutter Flash Animation
  const flashOpacity = useSharedValue(0);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const handleCapture = () => {
    // 1. Shutter flash visual feedback
    flashOpacity.value = withSequence(
      withTiming(0.85, { duration: 40 }),
      withTiming(0, { duration: 160 })
    );

    // 2. Set sample captured URI & navigate to editor
    const mockUri = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000';
    setLastCapturedUri(mockUri);

    setTimeout(() => {
      router.push('/editor');
    }, 220);
  };

  if (!hasPermission) {
    return (
      <PermissionGate
        onAllow={() => setHasPermission(true)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Controls Bar */}
      <TopCameraBar />

      {/* Edge-to-Edge 9:16 Viewfinder */}
      <View style={styles.viewportWrapper}>
        <CameraViewportSlot />
      </View>

      {/* Floating Hero Voice Command Pill */}
      <VoiceCommandPill />

      {/* Single Contextual Tray (Scenes / Look / Adjust) */}
      <View style={styles.trayArea}>
        {activeTray === 'scenes' && <SceneFilmstrip />}
        {activeTray === 'look' && <LookFilmstrip />}
        {activeTray === 'adjust' && <AdjustTray />}
      </View>

      {/* Mode Tabs */}
      <ModeTabs />

      {/* Ergonomic Bottom Shutter Dock */}
      <ShutterDock onCapture={handleCapture} />

      {/* Settings Bottom Sheet */}
      <SettingsSheet />

      {/* Shutter White Screen Flash Overlay */}
      <Animated.View pointerEvents="none" style={[styles.shutterFlash, flashStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  viewportWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trayArea: {
    minHeight: 80,
    justifyContent: 'center',
  },
  shutterFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.shutterFlash,
    zIndex: 99,
  },
});
