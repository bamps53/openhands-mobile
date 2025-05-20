import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { loadSettings } from '../src/store/settingsSlice';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '../src/theme/theme';

export default function RootLayout() {
  useEffect(() => {
    store.dispatch(loadSettings());
  }, []);
  return (
    <Provider store={store}>
      <PaperProvider theme={lightTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </Provider>
  );
}
