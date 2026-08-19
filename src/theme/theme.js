/**
 * @file theme.js
 * @description Sistema centralizado de tokens de diseño para City Explorer.
 * Sigue la estructura aprobada en el Plan de Migración (sección 6.1.3):
 * colors.brand, colors.background.screen, colors.text.primary, colors.border.light,
 * typography.fonts y typography.sizes.
 *
 * Se conservan aliases planos (colors.primary, colors.surface, etc.) para
 * compatibilidad con código heredado, pero todo estilo nuevo debe usar los
 * tokens anidados.
 */
import { Platform } from 'react-native';

export const colors = {
  brand: {
    primary: '#A74229', // Terracota principal para botones y acentos
  },
  background: {
    base: '#FFFFFF', // Tarjetas y modales
    screen: '#FCF8F5', // Fondo general de vistas
    dark: '#3D3836', // Footer y secciones invertidas
  },
  text: {
    primary: '#1E1A19', // Títulos de alto contraste
    secondary: '#7A7571', // Descripciones y placeholders
    inverse: '#FFFFFF', // Texto sobre fondos oscuros o primarios
  },
  border: {
    light: '#E5E0DC', // Divisores y bordes de inputs
  },
  // Alias de compatibilidad con el código heredado
  primary: '#A74229',
  secondary: '#3D3836',
  surface: '#FFFFFF',
  textSecondary: '#7A7571',
  error: '#B3261E',
  success: '#388E3C',
  warning: '#F57C00',
  accent: '#E57357',
};

// Fuentes del sistema: garantizan el renderizado correcto de acentos del español.
// Las fuentes de marca del plan (Playfair Display / Inter) requieren cargarse con expo-font.
const headingFont = Platform.OS === 'ios' ? 'System' : 'sans-serif';
const bodyFont = Platform.OS === 'ios' ? 'System' : 'sans-serif';

export const typography = {
  fonts: {
    heading: headingFont,
    body: bodyFont,
    bodyMedium: bodyFont,
  },
  sizes: {
    xs: 12, // Etiquetas y metadatos
    sm: 14, // Textos secundarios y legales
    md: 16, // Cuerpo de texto estándar
    lg: 20, // Títulos de tarjetas
    xl: 24, // Títulos de sección
    xxl: 32, // Encabezados principales
  },
  h1: { fontSize: 28, fontFamily: headingFont, fontWeight: 'bold', color: colors.text.primary, lineHeight: 34 },
  h2: { fontSize: 22, fontFamily: headingFont, fontWeight: 'bold', color: colors.text.primary, lineHeight: 28 },
  h3: { fontSize: 18, fontFamily: headingFont, fontWeight: '600', color: colors.text.primary, lineHeight: 24 },
  body: { fontSize: 16, fontFamily: bodyFont, fontWeight: 'normal', color: colors.text.primary, lineHeight: 22 },
  caption: { fontSize: 14, fontFamily: bodyFont, fontWeight: 'normal', color: colors.text.secondary, lineHeight: 18 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24, // Márgenes laterales de la pantalla
  xl: 32,
};

export const radius = {
  sm: 4,
  md: 8, // Botones e inputs
  lg: 12, // Tarjetas principales
  xl: 16,
  full: 9999,
};

const theme = { colors, typography, spacing, radius };
export default theme;