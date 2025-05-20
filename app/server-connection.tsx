import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
// import * as SecureStore from 'expo-secure-store'; // SecureStoreを一時的にコメントアウト

import { RootState, AppDispatch } from '../src/store';
import { connectStart, connectSuccess, connectFailure } from '../src/store/authSlice';
import { initializeApiClient, testServerConnection } from '../src/api/client';
import { theme } from '../src/theme/theme';

// const LAST_SUCCESSFUL_URL_KEY = 'lastSuccessfulServerUrl'; // SecureStore関連コメントアウト
const DEFAULT_SERVER_URL = 'http://localhost:3000';

const ServerConnectionScreen = ({ navigation }: any) => {
  const [serverUrlInput, setServerUrlInput] = useState(DEFAULT_SERVER_URL); // 初期値を直接設定
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isConnecting, error, isConnected, serverUrl: storedServerUrl } = useSelector((state: RootState) => state.auth);
  // isLoadingStoredUrl は SecureStore を使わないため、常に false または削除
  const [isLoadingStoredUrl, setIsLoadingStoredUrl] = useState(false); 

  /* SecureStoreの読み込み処理を一時的にコメントアウト
  useEffect(() => {
    const loadStoredUrl = async () => {
      setIsLoadingStoredUrl(true); // 開始時にtrue
      try {
        // const storedUrl = await SecureStore.getItemAsync(LAST_SUCCESSFUL_URL_KEY);
        // if (storedUrl) {
        //   setServerUrlInput(storedUrl);
        // } else {
        //   setServerUrlInput(DEFAULT_SERVER_URL);
        // }
        setServerUrlInput(DEFAULT_SERVER_URL); // 一時的に常にデフォルトを使用
      } catch (e) {
        console.error('Failed to load URL from secure store', e);
        setServerUrlInput(DEFAULT_SERVER_URL);
      } finally {
        setIsLoadingStoredUrl(false);
      }
    };
    loadStoredUrl();
  }, []);
  */

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

    // 末尾のスラッシュを除去
    if (trimmedUserInput.endsWith('/')) {
      trimmedUserInput = trimmedUserInput.slice(0, -1);
    }

    let finalUrlToProcess = trimmedUserInput;
    if (!finalUrlToProcess.startsWith('http://') && !finalUrlToProcess.startsWith('https://')) {
      finalUrlToProcess = `http://${finalUrlToProcess}`;
    }
    
    console.log(`Attempting connection with processed URL: ${finalUrlToProcess}`); // 処理後のURLをログに出力

    try {
      const connectionSuccessful = await testServerConnection(finalUrlToProcess);
      if (connectionSuccessful) {
        await initializeApiClient({ url: finalUrlToProcess });
        // await SecureStore.setItemAsync(LAST_SUCCESSFUL_URL_KEY, finalUrlToProcess); // SecureStore関連コメントアウト
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

  // isLoadingStoredUrlが常にfalseなので、このローディング表示は実質的に表示されなくなる
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    justifyContent: 'center',
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
