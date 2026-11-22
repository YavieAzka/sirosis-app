import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

export interface ModulePlaceholderCardProps {
  title: string;
  description: string;
  details?: string[];
  tone?: 'neutral' | 'safe' | 'warning' | 'danger' | 'info';
}

export function ModulePlaceholderCard({
  title,
  description,
  details,
  tone = 'neutral',
}: ModulePlaceholderCardProps) {
  const { theme } = useAppTheme();
  const { colors, typography, spacing, radii } = theme;

  const surfaceBg =
    tone === 'neutral'
      ? colors.surfaceContainerLow
      : colors.clinical[tone].container;
  const borderCol =
    tone === 'neutral'
      ? colors.outlineVariant
      : colors.clinical[tone].border;
  const headingCol =
    tone === 'neutral'
      ? colors.onSurface
      : colors.clinical[tone].onContainer;
  const bodyCol =
    tone === 'neutral'
      ? colors.onSurfaceVariant
      : colors.clinical[tone].onContainer;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: surfaceBg,
          borderColor: borderCol,
          borderRadius: radii.lg,
          padding: spacing.lg,
          gap: spacing.sm,
        },
      ]}
    >
      <Text style={[typography.titleMedium, { color: headingCol }]}>
        {title}
      </Text>
      <Text style={[typography.bodyMedium, { color: bodyCol }]}>
        {description}
      </Text>
      {details && details.length > 0 && (
        <View style={{ gap: spacing.xs, marginTop: spacing.xs }}>
          {details.map((item, idx) => (
            <Text key={idx} style={[typography.bodySmall, { color: bodyCol }]}>
              • {item}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});
