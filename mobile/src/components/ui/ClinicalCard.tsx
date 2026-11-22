import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

export type ClinicalCardTone =
  | 'neutral'
  | 'elevated'
  | 'safe'
  | 'warning'
  | 'danger'
  | 'info';

export interface ClinicalCardProps {
  children: React.ReactNode;
  tone?: ClinicalCardTone;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ClinicalCard({
  children,
  tone = 'neutral',
  style,
  testID,
}: ClinicalCardProps) {
  const { theme } = useAppTheme();
  const { colors, radii, spacing } = theme;

  let backgroundColor = colors.surfaceContainerLow;
  let borderColor = colors.outlineVariant;

  if (tone === 'elevated') {
    backgroundColor = colors.surface;
    borderColor = colors.outlineVariant;
  } else if (tone !== 'neutral') {
    backgroundColor = colors.clinical[tone].container;
    borderColor = colors.clinical[tone].border;
  }

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
          borderRadius: radii.lg,
          padding: spacing.lg,
          gap: spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});
