/**
 * @file Badge.js
 * @description Etiqueta de información compacta para estados o categorías.
 */
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { colors, spacing, radius } from '../../theme/theme';

export default function Badge({ label, active = false, onPress, style }) {
  const inner = (
    <AppText variant="caption" style={[styles.text, active ? styles.textActive : null]}>
      {label}
    </AppText>
  );
  if (!onPress) {
    return <View style={[styles.badge, active ? styles.active : null, style]}>{inner}</View>;
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.badge,
        active ? styles.active : null,
        pressed && styles.pressed,
        style,
      ]}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.background.base,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  active: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  textActive: {
    color: colors.text.inverse,
  },
  pressed: {
    opacity: 0.8,
  },
});