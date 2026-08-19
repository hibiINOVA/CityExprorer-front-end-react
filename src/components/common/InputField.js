/**
 * @file InputField.js
 * @description Componente atómico de campo de texto con etiqueta y mensaje de error.
 */
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AppText from './AppText';
import { colors, spacing, radius } from '../../theme/theme';

export default function InputField({ label, error, style, containerStyle, ...props }) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.text.secondary}
        {...props}
      />
      {error ? (
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontWeight: 'bold',
    color: colors.text.primary,
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: colors.background.base,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
  },
});