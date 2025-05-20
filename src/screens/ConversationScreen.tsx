import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { IconButton } from 'react-native-paper';
import ChatInput from '../components/ChatInput';

const Tab = createMaterialTopTabNavigator();

// 仮のチャットメッセージデータ
const MOCK_MESSAGES = [
  { id: '1', sender: 'user', text: 'Hello!' },
  { id: '2', sender: 'ai', text: 'Hi there! How can I assist you today?' },
  { id: '3', sender: 'user', text: "What's the weather like today?" },
  { id: '4', sender: 'ai', text: 'The weather is partly cloudy with a chance of rain later in the afternoon.' },
  { id: '5', sender: 'user', text: 'Can you help me with a task?' },
  { id: '6', sender: 'ai', text: 'Of course! What do you need assistance with?' },
];

// チャットタブの内容
const ChatTab = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleSendMessage = (message: string) => {
    if (message.trim() === '') return;
    
    // 新しいメッセージを追加
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
    };
    
    setMessages([...messages, newMessage]);
    
    // AIの応答をシミュレート（実際の実装ではAPIを呼び出す）
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'I received your message. This is a placeholder response.',
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const renderMessage = ({ item }: any) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
      />
      
      <ChatInput onSendMessage={handleSendMessage} />
    </View>
  );
};

// ファイルタブの内容（プレースホルダー）
const FilesTab = () => (
  <View style={[styles.tabContent, styles.centeredContent]}>
    <Text>Files functionality will be implemented here</Text>
  </View>
);

// ターミナルタブの内容（プレースホルダー）
const TerminalTab = () => (
  <View style={[styles.tabContent, styles.centeredContent]}>
    <Text>Terminal functionality will be implemented here</Text>
  </View>
);

const ConversationScreen = ({ route, navigation }: any) => {
  const { workspaceName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          testID="arrow-left"
        />
        <Text style={styles.headerTitle}>OpenHands</Text>
      </View>
      
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
          tabBarLabelStyle: { fontWeight: 'bold' },
        }}
      >
        <Tab.Screen name="Chat" component={ChatTab} />
        <Tab.Screen name="Files" component={FilesTab} />
        <Tab.Screen name="Terminal" component={TerminalTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    padding: theme.spacing.m,
    paddingBottom: 80, // 入力欄の高さ分の余白
  },
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.m,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.backgroundLight,
  },
  messageText: {
    fontSize: 16,
    color: props => props.sender === 'user' ? '#FFFFFF' : theme.colors.text,
  },
});

export default ConversationScreen;
