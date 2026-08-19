/**
 * @file SectionHeader.js
 * @description Encabezado reutilizable para la distinción de bloques de contenido.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { spacing } from '../../theme/theme';

export default function SectionHeader({ title, style, ...props }) {
  return (
    <View style={[styles.container, style]} {...props}>
      <AppText variant="h3">{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
});