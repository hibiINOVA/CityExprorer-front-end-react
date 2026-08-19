/**
 * @file ScreenContainer.js
 * @description Contenedor estructural que integra Safe Area y espaciado lateral.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme/theme';

export default function ScreenContainer({ children, style, padded = true, ...props }) {
  return (
    <SafeAreaView
      style={[styles.container, padded ? styles.padded : null, style]}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
});