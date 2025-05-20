import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router'; 
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { RootState, store } from '../src/store';
import { theme as appTheme } from '../src/theme/theme'; 
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppInitializerAndNavigator() {
  const colorScheme = useColorScheme(); 
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { isConnected } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      if (!isConnected) {
        router.replace('/server-connection');
      } else {
        router.replace({ pathname: '/(tabs)' } as any); 
      }
    }
  }, [loaded, isConnected, router]);

  if (!loaded) {
    return null;
  }

  const navigationTheme = {
    ...DefaultTheme, 
    dark: colorScheme === 'dark', 
    colors: {
      ...DefaultTheme.colors, 
      primary: appTheme.colors.primary,
      background: appTheme.colors.background,
      card: appTheme.colors.card,
      text: appTheme.colors.text,
      border: appTheme.colors.border,
      notification: appTheme.colors.accent, 
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ 
        headerStyle: { backgroundColor: navigationTheme.colors.card }, 
        headerTintColor: navigationTheme.colors.text, 
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="server-connection" 
          options={{ 
            title: 'サーバー接続', 
            headerShown: false, 
          }} 
        />
        <Stack.Screen name="settings" options={{ title: '設定', presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <AppInitializerAndNavigator />
    </ReduxProvider>
  );
}
