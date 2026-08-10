import { Platform } from 'react-native';

export const colors = {
  primary: '#8C3722',        // Warm Terracotta / Reddish-Brown
  secondary: '#2D211A',      // Dark Charcoal Brown for headers/text
  background: '#F7F2EE',     // Warm cream / Light beige
  surface: '#FFFFFF',        // White for cards/fields
  text: '#2D211A',           // Dark text
  textSecondary: '#8C817C',  // Taupe / Muted text
  border: '#E5DFD9',         // Warm border color
  error: '#B3261E',          // Error red
  success: '#388E3C',
  warning: '#F57C00',
  accent: '#E57357',         // Terracotta accent
};

const titleFont = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const bodyFont = Platform.OS === 'ios' ? 'System' : 'sans-serif';

export const typography = {
  h1: { fontSize: 28, fontFamily: titleFont, fontWeight: 'bold', color: '#2D211A', lineHeight: 34 },
  h2: { fontSize: 22, fontFamily: titleFont, fontWeight: 'bold', color: '#2D211A', lineHeight: 28 },
  h3: { fontSize: 18, fontFamily: titleFont, fontWeight: '600', color: '#2D211A', lineHeight: 24 },
  body: { fontSize: 16, fontFamily: bodyFont, fontWeight: 'normal', color: '#2D211A', lineHeight: 22 },
  caption: { fontSize: 14, fontFamily: bodyFont, fontWeight: 'normal', color: '#8C817C', lineHeight: 18 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

const theme = { colors, typography, spacing, radius };
export default theme;
