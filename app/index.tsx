import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to OpenHands Mobile</Text>
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
  }
});
