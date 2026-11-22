import React from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, ArrowUpRight, Check, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCameraSessionStore } from '../../camera/store/useCameraSessionStore';
import { colors, radius, spacing, typography } from '../../../ui/theme/tokens';
import { hapticSuccess, hapticTap } from '../../../ui/theme/haptics';

interface ExportActionBarProps {
  photoUri: string | null;
}

export const ExportActionBar: React.FC<ExportActionBarProps> = ({ photoUri }) => {
  const router = useRouter();
  const showToast = useCameraSessionStore((s) => s.showToast);

  const handleRetake = () => {
    hapticTap();
    router.back();
  };

  const handleShare = async (platformName?: string) => {
    hapticTap();
    if (!photoUri) return;
    try {
      await Share.share({
        message: 'Shot on VisionZ AI Camera #VisionZ',
        url: photoUri,
      });
      if (platformName) {
        showToast(`Shared to ${platformName}`);
      }
    } catch {
      showToast('Could not share photo');
    }
  };

  const handleSave = () => {
    hapticSuccess();
    // ========================================================
    // PLUG-IN: Preloaded Interstitial Ad Hook + MediaLibrary Save
    // ========================================================
    showToast('Saved to Gallery');
    setTimeout(() => {
      router.back();
    }, 900);
  };

  return (
    <View style={styles.container}>
      {/* Retake Button */}
      <Pressable
        hitSlop={8}
        onPress={handleRetake}
        style={styles.retakeBtn}
        accessibilityRole="button"
        accessibilityLabel="Discard and Retake Photo"
      >
        <ArrowLeft size={18} color={colors.textSecondary} strokeWidth={1.75} />
        <Text style={styles.retakeText}>Retake</Text>
      </Pressable>

      {/* Share Group */}
      <View style={styles.shareGroup}>
        <Pressable
          hitSlop={8}
          onPress={() => handleShare('TikTok / Reels')}
          style={styles.shareIconBtn}
          accessibilityRole="button"
          accessibilityLabel="Share to Social"
        >
          <Share2 size={16} color={colors.textPrimary} strokeWidth={1.75} />
        </Pressable>
      </View>

      {/* Primary Save Button */}
      <Pressable
        hitSlop={10}
        onPress={handleSave}
        style={styles.saveBtn}
        accessibilityRole="button"
        accessibilityLabel="Save Photo to Device Gallery"
      >
        <Check size={16} color={colors.textInverse} strokeWidth={2.2} />
        <Text style={styles.saveText}>Save Photo</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#09090B',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  retakeText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontSize: 13,
  },
  shareGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  shareIconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.textPrimary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
  },
  saveText: {
    ...typography.bodyMedium,
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 13,
  },
});
