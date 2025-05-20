import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../src/store';

export default function HomeScreen() {
  const { isConnected, serverUrl } = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.container}>
      {isConnected && serverUrl ? (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>接続済み</Text>
          <Text style={styles.statusUrlText}>{serverUrl}</Text>
        </View>
      ) : (
        <Text style={styles.title}>Welcome to OpenHands Mobile</Text>
      )}
      <Link href="/chat" asChild>
        <Button mode="contained" style={styles.button}>
          Go to Chat
        </Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 15,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b2ebf2',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
  },
  statusUrlText: {
    fontSize: 14,
    color: '#004d40',
    marginTop: 4,
  }
});
