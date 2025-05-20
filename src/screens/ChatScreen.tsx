import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.messageContainer}>
          <List.Section style={styles.messageList}>
            {messages.map(msg => (
              <List.Item
                key={msg.id}
                title={msg.text}
                description={`${msg.sender} - ${msg.timestamp.toLocaleTimeString()}`}
                style={[
                  styles.messageItem,
                  msg.sender === 'user' ? styles.userMessage : styles.botMessage,
                  {
                    backgroundColor: msg.sender === 'user' ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                  }
                ]}
                titleStyle={{
                  color: msg.sender === 'user' ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
                }}
                descriptionStyle={{
                  color: msg.sender === 'user' ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
                  fontSize: 10,
                }}
              />
            ))}
          </List.Section>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            mode="outlined"
          />
          <Button mode="contained" onPress={handleSendMessage} style={styles.sendButton}>
            Send
          </Button>
        </View>
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
