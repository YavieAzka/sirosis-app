import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { TeamMember } from '@/constants/teamData';
import { useAppTheme } from '@/theme/ThemeProvider';

export interface TeamAvatarProps {
  member: TeamMember;
  size?: number;
}

export function TeamAvatar({ member, size = 84 }: TeamAvatarProps) {
  const { theme } = useAppTheme();
  const { colors, typography, radii } = theme;
  const [imageError, setImageError] = useState(false);

  return (
    <View
      testID={`team-avatar-${member.id}`}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radii.full,
          backgroundColor: colors.primaryContainer,
          borderColor: colors.outlineVariant,
        },
      ]}
    >
      <Text
        accessibilityElementsHidden={!imageError}
        style={[
          typography.titleLarge,
          { color: colors.onPrimaryContainer },
        ]}
      >
        {member.initials}
      </Text>

      {!imageError && (
        <Image
          source={member.photo}
          accessibilityLabel={member.name}
          onError={() => setImageError(true)}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: radii.full,
            },
          ]}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
