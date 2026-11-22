import React, { useEffect } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { colors, radius, spacing, typography, zIndex } from '../theme/tokens';
import { SPRING_SHEET } from '../theme/motion';
import { hapticTap } from '../theme/haptics';

interface SheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const SheetModal: React.FC<SheetModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(500);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(0, SPRING_SHEET);
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withSpring(500, SPRING_SHEET);
      backdropOpacity.value = withTiming(0, { duration: 180 });
    }
  }, [isOpen]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!isOpen) return null;

  const handleClose = () => {
    hapticTap();
    onClose();
  };

  return (
    <Modal transparent visible={isOpen} animationType="none" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* Bottom Sheet Card */}
        <Animated.View
          style={[
            styles.sheet,
            sheetStyle,
            { paddingBottom: Math.max(insets.bottom, spacing.base) },
          ]}
        >
          {/* Drag Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          {title ? (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable
                hitSlop={12}
                onPress={handleClose}
                style={styles.closeBtn}
                accessibilityRole="button"
                accessibilityLabel="Close sheet"
              >
                <X size={18} color={colors.textSecondary} strokeWidth={1.75} />
              </Pressable>
            </View>
          ) : null}

          {/* Content */}
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: zIndex.modal,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  sheet: {
    backgroundColor: '#121214',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    borderBottomWidth: 0,
    maxHeight: '85%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  title: {
    ...typography.headingSm,
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.base,
  },
});
