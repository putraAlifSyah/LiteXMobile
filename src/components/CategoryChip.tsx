import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { BorderRadius, Spacing } from '../constants/spacing';
import { useSettingsStore } from '../store/settingsStore';

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  isSelected,
  onPress,
}) => {
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);

  // In Newsify, even unselected chips have a primary color border
  const borderColor = isDarkMode ? Colors.dark.primary : Colors.primary;

  const backgroundColor = isSelected
    ? borderColor
    : 'transparent';

  const textColor = isSelected
    ? '#FFFFFF'
    : isDarkMode
      ? Colors.dark.text.primary
      : Colors.text.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1, // thinner border
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...Typography.subtitle2,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0,
  },
});

export default CategoryChip;
