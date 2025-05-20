import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { theme } from '@/theme';
import { store } from '@/store';

export default function RootLayout() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <Stack />
      </PaperProvider>
    </StoreProvider>
  );
}
