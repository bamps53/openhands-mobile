import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { RootState, AppDispatch } from '../src/store';
import { connectStart, connectSuccess, connectFailure } from '../src/store/authSlice';
import { initializeApiClient, testServerConnection } from '../src/api/client';
import { theme } from '../src/theme/theme';

const LAST_SUCCESSFUL_URL_KEY = 'lastSuccessfulServerUrl';
const DEFAULT_SERVER_URL = 'http://localhost:3000';

const ServerConnectionScreen = ({ navigation }: any) => {
  const [serverUrlInput, setServerUrlInput] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isConnecting, error, isConnected, serverUrl: storedServerUrl } = useSelector((state: RootState) => state.auth);
  const [isLoadingStoredUrl, setIsLoadingStoredUrl] = useState(true);

  useEffect(() => {
    const loadStoredUrl = async () => {
      setIsLoadingStoredUrl(true);
      try {
        let storedUrl = null;
        if (Platform.OS === 'web') {
          storedUrl = localStorage.getItem(LAST_SUCCESSFUL_URL_KEY);
        } else {
          storedUrl = await SecureStore.getItemAsync(LAST_SUCCESSFUL_URL_KEY);
        }
        
        if (storedUrl) {
          setServerUrlInput(storedUrl);
        } else {
          setServerUrlInput(DEFAULT_SERVER_URL);
        }
      } catch (e) {
        console.error('Failed to load URL from storage', e);
        setServerUrlInput(DEFAULT_SERVER_URL);
      } finally {
        setIsLoadingStoredUrl(false);
      }
    };
    loadStoredUrl();
  }, []);

  useEffect(() => {
    if (storedServerUrl) {
      setServerUrlInput(storedServerUrl);
    }
  }, [storedServerUrl]);

  useEffect(() => {
    if (isConnected) {
      router.replace('/');
    }
  }, [isConnected, router]);

  const handleConnect = async () => {
    let trimmedUserInput = serverUrlInput.trim();

    if (!trimmedUserInput) {
      Alert.alert('Error', 'Please enter a server URL.');
      return;
    }

    dispatch(connectStart());

    if (trimmedUserInput.endsWith('/')) {
      trimmedUserInput = trimmedUserInput.slice(0, -1);
    }

    let finalUrlToProcess = trimmedUserInput;
    if (!finalUrlToProcess.startsWith('http://') && !finalUrlToProcess.startsWith('https://')) {
      finalUrlToProcess = `http://${finalUrlToProcess}`;
    }
    
    console.log(`Attempting connection with processed URL: ${finalUrlToProcess}`);

    try {
      const connectionSuccessful = await testServerConnection(finalUrlToProcess);
      if (connectionSuccessful) {
        await initializeApiClient({ url: finalUrlToProcess });
        // URLの保存もPlatformによって分岐
        if (Platform.OS === 'web') {
          localStorage.setItem(LAST_SUCCESSFUL_URL_KEY, finalUrlToProcess);
        } else {
          await SecureStore.setItemAsync(LAST_SUCCESSFUL_URL_KEY, finalUrlToProcess);
        }
        dispatch(connectSuccess({ url: finalUrlToProcess }));
        Alert.alert('Success', 'Connected to server successfully!');
      } else {
        dispatch(connectFailure('Failed to connect to the server. Please check the URL and server status.'));
        Alert.alert('Error', 'Failed to connect to the server. Please check the URL and server status.');
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      dispatch(connectFailure(errorMessage));
      Alert.alert('Error', `Failed to connect: ${errorMessage}`);
    }
  };

  if (isLoadingStoredUrl) { 
    return (
      <View style={styles.centeredLoaderContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loaderText}>Loading server settings...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 50} // Androidにもオフセット20を設定
        enabled
      >
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>OpenHands</Text>
          </View>
          
          <Text style={styles.title}>Server Connection</Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Server URL</Text>
            <TextInput
              style={styles.input}
              placeholder="http://localhost:3000"
              value={serverUrlInput}
              onChangeText={setServerUrlInput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Connect</Text>
              )}
            </TouchableOpacity>
            
            {error && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m, 
  },
  scrollContentContainer: { 
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredLoaderContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loaderText: { 
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.text,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colors.text,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: theme.spacing.m, 
  },
  label: {
    fontSize: 16,
    marginBottom: theme.spacing.s,
    color: theme.colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    fontSize: 16,
    marginBottom: theme.spacing.l,
    backgroundColor: theme.colors.backgroundLight,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.l,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.roundness,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
  },
});

export default ServerConnectionScreen;
