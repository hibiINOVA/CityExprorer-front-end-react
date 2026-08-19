import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './common/AppText';
import AppButton from './common/AppButton';
import { colors, spacing } from '../theme/theme';

/**
 * EmptyState - estado vacío genérico con icono, mensaje y acción opcional.
 */
export default function EmptyState({
  icon = 'leaf-outline',
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={40} color={colors.brand.primary} />
      </View>
      {title ? <AppText variant="h2" style={styles.title}>{title}</AppText> : null}
      {message ? <AppText variant="body" style={styles.message}>{message}</AppText> : null}
      {actionLabel && onAction ? (
        <AppButton title={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.sm,
    maxWidth: 260,
  },
});