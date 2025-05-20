// Common theme settings for the application

export const theme = {
  colors: {
    background: '#FFFFFF',
    primary: '#007AFF', // A standard blue, good for primary actions
    secondary: '#5856D6', // A purple, can be used for accents or secondary actions
    error: '#FF3B30', // A standard red for errors
    success: '#34C759', // A standard green for success states
    warning: '#FF9500', // A standard orange for warnings
    text: '#000000', // Black for primary text
    textSecondary: '#8A8A8E', // Gray for secondary text or placeholders
    border: '#C6C6C8', // Light gray for borders
    card: '#F2F2F7', // Very light gray for card backgrounds or sections
    backgroundLight: '#F2F2F7', // Similar to card, for input fields or light backgrounds
    disabled: '#D1D1D6', // Gray for disabled states
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  roundness: 8, // Consistent border radius for components
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 12,
      color: '#8A8A8E',
    },
  },
};
