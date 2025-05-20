// Common theme settings for the application

export const theme = {
  colors: {
    primary: '#3B82F6',      // プライマリカラー (青)
    secondary: '#10B981',    // セカンダリカラー (緑)
    accent: '#6366F1',       // アクセントカラー (紫)
    background: '#FFFFFF',   // 背景色 (白)
    backgroundLight: '#F3F4F6', // 背景色 (薄いグレー)
    text: '#111827',         // テキスト色 (濃いグレー)
    textSecondary: '#6B7280',// テキスト色 (中間グレー)
    error: '#EF4444',        // エラー色 (赤)
    warning: '#F59E0B',      // 警告色 (オレンジ)
    success: '#10B981',      // 成功色 (緑)
    border: '#D1D5DB',       // ボーダー色 (中間グレー)
    card: '#FFFFFF',         // カード背景色 (白)
    disabled: '#D1D5DB',     // 無効状態の色 (中間グレー)
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
      fontSize: 24,
      fontWeight: 'bold' as const,
    },
    h2: {
      fontSize: 20,
      fontWeight: 'bold' as const,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600' as const, // SemiBold
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const, // Regular
    },
    smallText: {
      fontSize: 14,
      fontWeight: 'normal' as const, // Regular
    },
    smallestText: {
      fontSize: 12,
      fontWeight: 'normal' as const, // Regular
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal' as const, // Regular
      color: '#6B7280', // textSecondary に合わせる
    },
  },
};
