import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '../src/store';
import { connectStart, connectSuccess, connectFailure } from '../src/store/authSlice';
import { testServerConnection, initializeApiClient } from '../src/api/client';
import { theme } from '../src/theme/theme';

const ServerConnectionScreen = ({ navigation }: any) => {
  const [serverUrl, setServerUrl] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isConnecting, error, isConnected, serverUrl: storedServerUrl } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (storedServerUrl) {
      setServerUrl(storedServerUrl);
    }
  }, [storedServerUrl]);

  useEffect(() => {
    if (isConnected) {
      router.replace('/');
    }
  }, [isConnected, router]);

  const handleConnect = async () => {
    if (!serverUrl.trim()) {
      Alert.alert('Error', 'Please enter a server URL.');
      return;
    }

    let url = serverUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }

    dispatch(connectStart());

    try {
      const connectionSuccessful = await testServerConnection(url);

      if (connectionSuccessful) {
        await initializeApiClient({ url });
        dispatch(connectSuccess({ url }));
      } else {
        dispatch(connectFailure('Failed to connect to the server. Please check the URL.'));
      }
    } catch (e: any) {
      dispatch(connectFailure('Connection error: ' + (e instanceof Error ? e.message : 'Unknown error')));
    }
  };

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
          value={serverUrl}
          onChangeText={setServerUrl}
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
