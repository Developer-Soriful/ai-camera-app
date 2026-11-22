import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { ImageIcon, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCameraSessionStore } from '../store/useCameraSessionStore';
import { colors, radius, spacing } from '../../../ui/theme/tokens';
import { SPRING_SHUTTER, SPRING_SNAPPY } from '../../../ui/theme/motion';
import { hapticShutter, hapticTap } from '../../../ui/theme/haptics';

interface ShutterDockProps {
  onCapture: () => void;
}

export const ShutterDock: React.FC<ShutterDockProps> = ({ onCapture }) => {
  const router = useRouter();

  const cameraPosition = useCameraSessionStore((s) => s.cameraPosition);
  const flipCamera = useCameraSessionStore((s) => s.flipCamera);
  const lastCapturedUri = useCameraSessionStore((s) => s.lastCapturedUri);
  const setLastCapturedUri = useCameraSessionStore((s) => s.setLastCapturedUri);
  const showToast = useCameraSessionStore((s) => s.showToast);

  // Reanimated Shared Values
  const shutterScale = useSharedValue(1);
  const flipRotation = useSharedValue(0);

  const shutterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shutterScale.value }],
  }));

  const flipAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${flipRotation.value}deg` }],
  }));

  const handleShutterPressIn = () => {
    shutterScale.value = withSpring(0.90, SPRING_SHUTTER);
  };

  const handleShutterPressOut = () => {
    shutterScale.value = withSpring(1, SPRING_SHUTTER);
  };

  const handleShutterPress = () => {
    hapticShutter();
    onCapture();
  };

  const handleFlipPress = () => {
    hapticTap();
    flipRotation.value = withSpring(flipRotation.value + 180, SPRING_SNAPPY);
    flipCamera();
  };

  const handleGalleryPick = async () => {
    hapticTap();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setLastCapturedUri(uri);
        router.push('/editor');
      }
    } catch {
      showToast('Could not access gallery');
    }
  };

  return (
    <View style={styles.dockContainer}>
      {/* Left: Gallery Thumbnail / Import */}
      <Pressable
        hitSlop={8}
        onPress={handleGalleryPick}
        style={styles.sideButton}
        accessibilityRole="button"
        accessibilityLabel="Pick from Gallery"
      >
        {lastCapturedUri ? (
          <Image source={{ uri: lastCapturedUri }} style={styles.galleryThumb} />
        ) : (
          <View style={styles.galleryPlaceholder}>
            <ImageIcon size={20} color={colors.textSecondary} strokeWidth={1.75} />
          </View>
        )}
      </Pressable>

      {/* Center: Hardware Shutter Button */}
      <Animated.View style={shutterAnimatedStyle}>
        <Pressable
          hitSlop={12}
          onPressIn={handleShutterPressIn}
          onPressOut={handleShutterPressOut}
          onPress={handleShutterPress}
          style={styles.shutterOuter}
          accessibilityRole="button"
          accessibilityLabel="Capture Photo"
        >
          <View style={styles.shutterInner} />
        </Pressable>
      </Animated.View>

      {/* Right: Camera Flip with 180° Spring */}
      <Pressable
        hitSlop={8}
        onPress={handleFlipPress}
        style={styles.sideButton}
        accessibilityRole="button"
        accessibilityLabel={`Flip Camera (Current: ${cameraPosition})`}
      >
        <Animated.View style={flipAnimatedStyle}>
          <RefreshCw size={20} color={colors.textPrimary} strokeWidth={1.75} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  dockContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  sideButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  galleryThumb: {
    width: '100%',
    height: '100%',
    borderRadius: radius.pill,
  },
  galleryPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.textPrimary,
  },
});
