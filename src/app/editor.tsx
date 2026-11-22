import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Crop, Eye, Palette, Sliders, Stamp } from 'lucide-react-native';
import { useCameraSessionStore } from '../features/camera/store/useCameraSessionStore';
import { LookFilmstrip } from '../features/editor/components/LookFilmstrip';
import { AdjustTray } from '../features/editor/components/AdjustTray';
import { CropOverlay } from '../features/editor/components/CropOverlay';
import { ExportActionBar } from '../features/editor/components/ExportActionBar';
import { WatermarkSheet } from '../features/editor/components/WatermarkSheet';
import { colors, radius, spacing, typography } from '../ui/theme/tokens';
import { hapticTap } from '../ui/theme/haptics';

type EditorTool = 'none' | 'crop' | 'look' | 'adjust';
const SAMPLE_URI = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000';

export default function EditorScreen() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<EditorTool>('none');
  const [isComparing, setIsComparing] = useState(false);

  const lastCapturedUri = useCameraSessionStore((s) => s.lastCapturedUri);
  const watermarkEnabled = useCameraSessionStore((s) => s.watermarkEnabled);
  const setWatermarkSheetOpen = useCameraSessionStore((s) => s.setWatermarkSheetOpen);
  const selectedLookId = useCameraSessionStore((s) => s.selectedLookId);
  const aspectRatio = useCameraSessionStore((s) => s.aspectRatio);

  const photoUri = lastCapturedUri || SAMPLE_URI;

  const toggleTool = (tool: EditorTool) => {
    hapticTap();
    setActiveTool((curr) => (curr === tool ? 'none' : tool));
  };

  const ratioStyle = aspectRatio === '1:1' ? { aspectRatio: 1 } : aspectRatio === '4:5' ? { aspectRatio: 4 / 5 } : { aspectRatio: 9 / 16 };

  return (
    <View style={styles.container}>
      {/* Top Bar with Camera Return & Hold-to-Compare */}
      <View style={styles.topBar}>
        <Pressable hitSlop={12} onPress={() => { hapticTap(); router.back(); }} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back to camera">
          <ArrowLeft size={19} color={colors.textPrimary} strokeWidth={1.75} />
          <Text style={styles.topBtnText}>Camera</Text>
        </Pressable>

        <Pressable onPressIn={() => { hapticTap(); setIsComparing(true); }} onPressOut={() => setIsComparing(false)} style={[styles.comparePill, isComparing && styles.comparePillActive]} accessibilityRole="button" accessibilityLabel="Hold to compare">
          <Eye size={13} color={isComparing ? colors.accent : colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.compareText, isComparing && styles.compareTextActive]}>{isComparing ? 'ORIGINAL' : 'HOLD COMPARE'}</Text>
        </Pressable>
      </View>

      {/* Main Center Canvas with Long-Press Comparison */}
      <View style={styles.viewportContainer}>
        <Pressable onPressIn={() => { hapticTap(); setIsComparing(true); }} onPressOut={() => setIsComparing(false)} style={[styles.imageCard, ratioStyle]}>
          <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />

          {isComparing && (
            <View style={styles.compareBadge}>
              <Text style={styles.compareBadgeText}>ORIGINAL</Text>
            </View>
          )}

          {watermarkEnabled && !isComparing && (
            <View style={styles.watermark}>
              <View style={styles.watermarkDot} />
              <Text style={styles.watermarkText}>SHOT ON VISIONZ</Text>
            </View>
          )}

          {activeTool === 'crop' && <CropOverlay />}
        </Pressable>
      </View>

      {/* Contextual Drawer for Look or Adjust */}
      <View style={styles.trayArea}>
        {activeTool === 'look' && <LookFilmstrip />}
        {activeTool === 'adjust' && <AdjustTray />}
      </View>

      {/* Tool Rail */}
      <View style={styles.toolRail}>
        <Pressable onPress={() => toggleTool('crop')} style={styles.toolBtn} accessibilityRole="button" accessibilityLabel="Crop">
          <Crop size={18} color={activeTool === 'crop' ? colors.accent : colors.textSecondary} strokeWidth={1.75} />
          <Text style={[styles.toolLabel, activeTool === 'crop' && styles.toolLabelActive]}>Crop</Text>
        </Pressable>

        <Pressable onPress={() => toggleTool('look')} style={styles.toolBtn} accessibilityRole="button" accessibilityLabel="Look">
          <Palette size={18} color={activeTool === 'look' ? colors.accent : colors.textSecondary} strokeWidth={1.75} />
          <Text style={[styles.toolLabel, activeTool === 'look' && styles.toolLabelActive]}>Look</Text>
        </Pressable>

        <Pressable onPress={() => toggleTool('adjust')} style={styles.toolBtn} accessibilityRole="button" accessibilityLabel="Adjust">
          <Sliders size={18} color={activeTool === 'adjust' ? colors.accent : colors.textSecondary} strokeWidth={1.75} />
          <Text style={[styles.toolLabel, activeTool === 'adjust' && styles.toolLabelActive]}>Adjust</Text>
        </Pressable>

        <Pressable onPress={() => { hapticTap(); setWatermarkSheetOpen(true); }} style={styles.toolBtn} accessibilityRole="button" accessibilityLabel="Watermark">
          <Stamp size={18} color={watermarkEnabled ? colors.accent : colors.textMuted} strokeWidth={1.75} />
          <Text style={[styles.toolLabel, watermarkEnabled && { color: colors.accent }]}>{watermarkEnabled ? 'WM: On' : 'WM: Off'}</Text>
        </Pressable>
      </View>

      {/* Bottom Export Bar & Modal */}
      <ExportActionBar photoUri={photoUri} />
      <WatermarkSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.xs,
  },
  topBtnText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  comparePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  comparePillActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  compareText: {
    ...typography.labelTiny,
    fontSize: 10,
    color: colors.textSecondary,
  },
  compareTextActive: {
    color: colors.accent,
  },
  viewportContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  imageCard: {
    width: '100%',
    maxHeight: '100%',
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#09090B',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  compareBadge: {
    position: 'absolute',
    top: spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  compareBadgeText: {
    ...typography.labelTiny,
    fontSize: 10,
    color: colors.accent,
  },
  watermark: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSubtle,
  },
  watermarkDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
  },
  watermarkText: {
    ...typography.labelTiny,
    fontSize: 8.5,
    color: colors.textPrimary,
    letterSpacing: 0.8,
  },
  trayArea: {
    minHeight: 80,
    justifyContent: 'center',
  },
  toolRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
    backgroundColor: '#0A0A0C',
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    minHeight: 44,
    gap: 4,
  },
  toolLabel: {
    ...typography.labelTiny,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'none',
  },
  toolLabelActive: {
    color: colors.accent,
    fontWeight: '600',
  },
});
