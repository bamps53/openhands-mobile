import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#6366F1',
    background: '#FFFFFF',
    backgroundLight: '#F3F4F6',
    text: '#111827',
    textSecondary: '#6B7280',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
  },
  fonts: {
    ...DefaultTheme.fonts,
    // Using system fonts as specified in the design
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  roundness: 8,
};

export type AppTheme = typeof theme;
