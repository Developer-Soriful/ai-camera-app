import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LOOK_PRESETS, LookPreset } from '../../backgrounds/data/presets';
import { useCameraSessionStore } from '../../camera/store/useCameraSessionStore';
import { colors, radius, spacing, typography } from '../../../ui/theme/tokens';
import { hapticTick } from '../../../ui/theme/haptics';

export const LookFilmstrip: React.FC = () => {
  const selectedLookId = useCameraSessionStore((s) => s.selectedLookId);
  const selectLook = useCameraSessionStore((s) => s.selectLook);
  const showToast = useCameraSessionStore((s) => s.showToast);

  const handleSelect = (item: LookPreset) => {
    hapticTick();
    selectLook(item.id);
    showToast(`Look: ${item.name}`);
  };

  const renderItem = ({ item }: { item: LookPreset }) => {
    const isSelected = item.id === selectedLookId;
    return (
      <Pressable
        hitSlop={4}
        onPress={() => handleSelect(item)}
        style={[styles.card, isSelected && styles.cardSelected]}
        accessibilityRole="button"
        accessibilityLabel={`Select Look: ${item.name}`}
      >
        <View
          style={[
            styles.swatch,
            { backgroundColor: item.previewColor },
            isSelected && styles.swatchSelected,
          ]}
        />
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
        data={LOOK_PRESETS}
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
    height: 76,
    justifyContent: 'center',
    backgroundColor: 'rgba(12, 12, 14, 0.85)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
    gap: 6,
    minWidth: 48,
  },
  cardSelected: {
    transform: [{ scale: 1.05 }],
  },
  swatch: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  swatchSelected: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  name: {
    ...typography.labelTiny,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.accent,
    fontWeight: '700',
  },
});
