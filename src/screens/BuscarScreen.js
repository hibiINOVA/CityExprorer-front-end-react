import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/theme';

export default function BuscarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar</Text>
      <Text style={styles.text}>Búsqueda (pendiente: integración de filtros y buscador)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    ...typography.h1,
    marginBottom: 8,
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
