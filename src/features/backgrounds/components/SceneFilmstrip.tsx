import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Play } from 'lucide-react-native';
import { SCENE_PRESETS, ScenePreset } from '../data/presets';
import { useCameraSessionStore } from '../../camera/store/useCameraSessionStore';
import { colors, radius, spacing, typography } from '../../../ui/theme/tokens';
import { hapticTick } from '../../../ui/theme/haptics';

export const SceneFilmstrip: React.FC = () => {
  const selectedSceneId = useCameraSessionStore((s) => s.selectedSceneId);
  const selectScene = useCameraSessionStore((s) => s.selectScene);
  const showToast = useCameraSessionStore((s) => s.showToast);

  const handleSelect = (item: ScenePreset) => {
    hapticTick();
    selectScene(item.id);
    if (item.isAdLocked) {
      showToast(`Cloud Scene: ${item.name} · Ad Sponsored`);
    } else {
      showToast(`Scene: ${item.name}`);
    }
  };

  const renderItem = ({ item }: { item: ScenePreset }) => {
    const isSelected = item.id === selectedSceneId;
    return (
      <Pressable
        hitSlop={4}
        onPress={() => handleSelect(item)}
        style={[styles.card, isSelected && styles.cardSelected]}
        accessibilityRole="button"
        accessibilityLabel={`Select Scene: ${item.name}`}
      >
        <View
          style={[
            styles.thumbnail,
            { backgroundColor: item.thumbnailGradient[0] },
          ]}
        >
          {item.isAdLocked && (
            <View style={styles.adBadge}>
              <Play size={8} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
            </View>
          )}
        </View>

        <Text numberOfLines={1} style={[styles.name, isSelected && styles.nameSelected]}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={SCENE_PRESETS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 98,
    justifyContent: 'center',
    backgroundColor: 'rgba(12, 12, 14, 0.85)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    alignItems: 'center',
  },
  card: {
    width: 60,
    alignItems: 'center',
    gap: 4,
  },
  cardSelected: {
    transform: [{ scale: 1.04 }],
  },
  thumbnail: {
    width: 56,
    height: 70,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 3,
  },
  adBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.labelTiny,
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.accent,
    fontWeight: '700',
  },
});
