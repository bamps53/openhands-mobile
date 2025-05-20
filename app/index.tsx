import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../src/store';
import { fetchConversations } from '../src/store/conversationSlice';
import React, { useEffect } from 'react';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { isConnected, serverUrl } = useSelector((state: RootState) => state.auth);
  const { 
    conversations, 
    status: conversationStatus, 
    error: conversationError 
  } = useSelector((state: RootState) => state.conversations);

  useEffect(() => {
    if (isConnected && conversationStatus === 'idle') {
      dispatch(fetchConversations());
    }
  }, [isConnected, conversationStatus, dispatch]);

  const renderConversationHistory = () => {
    if (!isConnected) return null;

    if (conversationStatus === 'loading') {
      return <ActivityIndicator size="large" color="#00796b" style={styles.loader} />;
    }

    if (conversationStatus === 'failed') {
      return <Text style={styles.errorText}>Error fetching conversations: {conversationError}</Text>;
    }

    if (conversationStatus === 'succeeded') {
      if (!conversations || conversations.length === 0) {
        return <Text style={styles.infoText}>会話履歴はありません。</Text>;
      }
      return (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>会話履歴</Text>
          <ScrollView style={styles.historyScrollView}>
            {conversations.map((convo) => (
              <View key={convo.conversation_id} style={styles.conversationItem}>
                <Text style={styles.conversationName}>{convo.title}</Text>
                <Text style={styles.conversationTimestamp}>最終更新: {new Date(convo.last_updated_at).toLocaleString()}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }
    return null;
  };

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

      {renderConversationHistory()} 

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
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  historyContainer: {
    width: '100%',
    maxHeight: '50%',
    marginTop: 20,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  historyScrollView: {
    // スタイルが必要な場合はここに追加
  },
  conversationItem: {
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  conversationTimestamp: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
});
