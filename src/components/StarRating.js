import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';

/**
 * StarRating - muestra calificación con estrellas (llena, media, vacía).
 * Si recibe `onChange`, se comporta como selector interactivo de 1 a 5.
 */
export default function StarRating({ value = 0, size = 16, onChange, color = colors.primary }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {stars.map((star) => {
        let iconName;
        if (value >= star) {
          iconName = 'star';
        } else if (value >= star - 0.5) {
          iconName = 'star-half';
        } else {
          iconName = 'star-outline';
        }

        if (onChange) {
          return (
            <Pressable
              key={star}
              onPress={() => onChange(star)}
              hitSlop={8}
              style={styles.pressable}
            >
              <Ionicons name={iconName} size={size} color={color} />
            </Pressable>
          );
        }

        return <Ionicons key={star} name={iconName} size={size} color={color} />;
      })}
      {!onChange && value > 0 ? (
        <Text style={[styles.valueText, { fontSize: size - 2 }]}>
          {Number(value).toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pressable: {
    padding: spacing.xs,
  },
  valueText: {
    marginLeft: spacing.xs,
    color: colors.text.primary,
    fontWeight: '600',
  },
});