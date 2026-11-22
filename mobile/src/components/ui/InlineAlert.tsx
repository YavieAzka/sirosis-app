import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
} from 'lucide-react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

export type AlertTone = 'info' | 'warning' | 'danger' | 'safe';

export interface InlineAlertProps {
  tone: AlertTone;
  title?: string;
  message: string;
  action?: React.ReactNode;
  testID?: string;
}

const ICON_BY_TONE = {
  info: Info,
  warning: AlertTriangle,
  danger: ShieldAlert,
  safe: CheckCircle2,
};

export function InlineAlert({
  tone,
  title,
  message,
  action,
  testID,
}: InlineAlertProps) {
  const { theme } = useAppTheme();
  const { colors, typography, radii, spacing } = theme;
  const rolePalette = colors.clinical[tone];
  const Icon = ICON_BY_TONE[tone];

  return (
    <View
      testID={testID}
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {
          backgroundColor: rolePalette.container,
          borderColor: rolePalette.border,
          borderRadius: radii.md,
          padding: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      <View style={[styles.row, { gap: spacing.sm }]}>
        <Icon size={20} color={rolePalette.onContainer} strokeWidth={2} />
        <View style={{ flex: 1, gap: spacing.xxs }}>
          {title ? (
            <Text
              style={[
                typography.titleSmall,
                { color: rolePalette.onContainer },
              ]}
            >
              {title}
            </Text>
          ) : null}
          <Text
            style={[typography.bodySmall, { color: rolePalette.onContainer }]}
          >
            {message}
          </Text>
        </View>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
