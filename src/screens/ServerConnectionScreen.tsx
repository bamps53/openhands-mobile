import React from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { connectStart, connectSuccess, connectFailure } from '../store/authSlice';
import { testServerConnection, initializeApiClient } from '../api/client';
import { theme } from '../theme/theme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const ServerConnectionScreen = ({ navigation }: any) => {
  const [serverUrl, setServerUrl] = React.useState('');
  const dispatch = useDispatch();
  const { isConnecting, error } = useSelector((state: RootState) => state.auth);

  const handleConnect = async () => {
    if (!serverUrl.trim()) {
      return;
    }

    // URLの正規化
    let url = serverUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }

    dispatch(connectStart());

    try {
      const isConnected = await testServerConnection(url);
      
      if (isConnected) {
        await initializeApiClient({ url });
        dispatch(connectSuccess({ url }));
        navigation.navigate('Home');
      } else {
        dispatch(connectFailure('サーバーに接続できませんでした。URLを確認してください。'));
      }
    } catch (error) {
      dispatch(connectFailure('接続エラー: ' + (error instanceof Error ? error.message : '不明なエラー')));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>OpenHands</Text>
      </View>
      
      <Text style={styles.title}>Server Connection</Text>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Server URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com"
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
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: theme.spacing.s,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    fontSize: 16,
    marginBottom: theme.spacing.l,
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
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
  },
});

export default ServerConnectionScreen;
