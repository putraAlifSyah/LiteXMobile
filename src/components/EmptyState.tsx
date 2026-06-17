import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, FontSizes, FontWeights } from '../constants/typography';
import { BorderRadius, Spacing } from '../constants/spacing';
import { useSettingsStore } from '../store/settingsStore';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);

  const textPrimary = isDarkMode ? Colors.dark.text.primary : Colors.text.primary;
  const textSecondary = isDarkMode ? Colors.dark.text.secondary : Colors.text.secondary;
  const iconColor = isDarkMode ? Colors.dark.text.disabled : Colors.text.disabled;

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={iconColor} style={styles.icon} />

      <Text style={[styles.title, { color: textPrimary }]}>{title}</Text>

      <Text style={[styles.subtitle, { color: textSecondary }]}>
        {subtitle}
      </Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAction}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['3xl'],
  },
  icon: {
    marginBottom: Spacing.base,
    opacity: 0.6,
  },
  title: {
    ...Typography.h4,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * 1.5,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius['2xl'],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.3,
  },
});

export default EmptyState;
