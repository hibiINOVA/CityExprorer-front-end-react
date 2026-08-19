/**
 * @file AppText.js
 * @description Componente atómico para normalizar la jerarquía tipográfica.
 * Uso: <AppText variant="h1|h2|h3|body|caption" style={...} />
 */
import React from 'react';
import { Text } from 'react-native';
import { typography } from '../../theme/theme';

export default function AppText({ variant = 'body', style, ...props }) {
  return <Text {...props} style={[typography[variant] || typography.body, style]} />;
}