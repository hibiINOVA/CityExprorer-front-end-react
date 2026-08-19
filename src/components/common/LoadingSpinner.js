/**
 * @file LoadingSpinner.js
 * @description Indicador de carga para la gestión de estados asíncronos de la API.
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme/theme';

export default function LoadingSpinner({ size = 'large', color = colors.brand.primary, style }) {
  return (
    <View style={[styles.center, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});