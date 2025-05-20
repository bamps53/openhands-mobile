import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, FlatList } from 'react-native';
import { TextInput, Button, List, PaperProvider, MD3Theme, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatScreen = () => {
  const theme = useTheme<MD3Theme>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Math.random().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');

    // Simulate bot response for now
    setTimeout(() => {
      const botResponse: Message = {
        id: Math.random().toString(),
        text: `You said: "${inputText}"`, // Simple echo bot
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessageItem = ({ item }: { item: Message }) => (
    <List.Item
      key={item.id}
      title={item.text}
      description={`${item.sender} - ${item.timestamp.toLocaleTimeString()}`}
      style={[
        styles.messageItem,
        item.sender === 'user' ? styles.userMessage : styles.botMessage,
        {
          backgroundColor: item.sender === 'user' ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
        }
      ]}
      titleStyle={{
        color: item.sender === 'user' ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
      }}
      descriptionStyle={{
        color: item.sender === 'user' ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
        fontSize: 10,
      }}
    />
  );

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
        >
          <View style={styles.messageContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={item => item.id}
              style={styles.messageList}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              mode="outlined"
              onSubmitEditing={handleSendMessage}
            />
            <Button mode="contained" onPress={handleSendMessage} style={styles.sendButton}>
              Send
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    marginVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    marginLeft: 50,
  },
  botMessage: {
    alignSelf: 'flex-start',
    marginRight: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  textInput: {
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
  },
});

export default ChatScreen;
