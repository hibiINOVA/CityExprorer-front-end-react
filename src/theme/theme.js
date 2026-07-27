/**
 * @file theme.js
 * @description Tokens de diseño según sección 6.1.3 del documento.
 * TODO: reemplazar valores placeholder con los tokens exactos del PDF.
 */

export const colors = {
  primary: '#4A90D9',
  secondary: '#FF6B35',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  // TODO: agregar colores del documento sección 6.1.3
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  caption: { fontSize: 14, fontWeight: '400', lineHeight: 18 },
  // TODO: ajustar según tabla del documento
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  // TODO: confirmar con documento
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
  // TODO: confirmar con documento
};

const theme = { colors, typography, spacing, radius };
export default theme;
