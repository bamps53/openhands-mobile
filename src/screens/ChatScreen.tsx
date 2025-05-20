import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, FlatList, Text } from 'react-native';
import { TextInput, MD3Theme, useTheme, Avatar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatScreen = () => {
  const theme = useTheme<MD3Theme>();
  const componentStyles = makeStyles(theme);
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ workspaceName?: string }>();
  const { workspaceName } = params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (workspaceName) {
      navigation.setOptions({ title: workspaceName });
    } else {
      navigation.setOptions({ title: 'Chat' }); // Default title
    }
  }, [navigation, workspaceName]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Math.random().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    const currentInput = inputText;
    setInputText('');

    setTimeout(() => {
      const botResponse: Message = {
        id: Math.random().toString(),
        text: `サーバーからの応答: "${currentInput}"`,
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

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUserMessage = item.sender === 'user';
    return (
      <View 
        style={[
          componentStyles.messageBubbleContainer,
          isUserMessage ? componentStyles.userMessageContainer : componentStyles.botMessageContainer
        ]}
      >
        {!isUserMessage && (
          <Avatar.Icon size={32} icon="robot" style={componentStyles.botAvatar} />
        )}
        <View 
          style={[
            componentStyles.messageBubble,
            isUserMessage ? componentStyles.userMessageBubble : componentStyles.botMessageBubble,
            { backgroundColor: isUserMessage ? theme.colors.primary : theme.colors.surfaceVariant }
          ]}
        >
          <Text style={[componentStyles.messageText, {color: isUserMessage ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
            {item.text}
          </Text>
          <Text style={[componentStyles.timestampText, {color: isUserMessage ? theme.colors.onPrimary : theme.colors.onSurfaceVariant, opacity: 0.7 }]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[componentStyles.container, { backgroundColor: theme.colors.background }]} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={componentStyles.messageContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={item => item.id}
            style={componentStyles.messageList}
            contentContainerStyle={componentStyles.messageListContent}
          />
        </View>
        <View style={[componentStyles.inputContainer, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            style={[componentStyles.textInput, { backgroundColor: theme.colors.background }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="メッセージを入力..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            mode="flat"
            textColor={theme.colors.onSurface}
            underlineColor="transparent"
            activeUnderlineColor={theme.colors.primary}
            onSubmitEditing={handleSendMessage}
          />
          <IconButton
            icon="send"
            size={24}
            iconColor={theme.colors.primary}
            onPress={handleSendMessage}
            style={componentStyles.sendButton}
            disabled={inputText.trim() === ''}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: MD3Theme) => StyleSheet.create({
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
  messageListContent: {
    paddingVertical: 10,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    marginRight: 8,
    backgroundColor: theme.colors.secondaryContainer,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  userMessageBubble: {
  },
  botMessageBubble: {
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
  },
});

export default ChatScreen;
