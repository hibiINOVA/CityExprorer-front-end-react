/**
 * @file PasswordField.js
 * @description Input especializado con lógica de visibilidad de contraseña.
 */
import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { colors, spacing, radius } from '../../theme/theme';

export default function PasswordField({ label, error, style, containerStyle, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={[styles.wrapper, error ? styles.inputError : null, style]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.secondary}
          secureTextEntry={!visible}
          {...props}
        />
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8} style={styles.eye}>
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.text.secondary} />
        </Pressable>
      </View>
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
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.base,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text.primary,
  },
  eye: {
    padding: spacing.xs,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
  },
});