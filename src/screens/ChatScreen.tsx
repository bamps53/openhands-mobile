import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, FlatList, Text, ActivityIndicator } from 'react-native';
import { TextInput, MD3Theme, useTheme, Avatar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { AppMessage, getConversationMessages, sendConversationMessage } from '../../src/api/client';

interface ChatScreenParams {
  workspaceId?: string;
  workspaceName?: string;
}

const ChatScreen = () => {
  const theme = useTheme<MD3Theme>();
  const componentStyles = makeStyles(theme);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const workspaceId = params.workspaceId as string | undefined;
  const workspaceName = params.workspaceName as string | undefined;

  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<AppMessage>>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const fetchMessages = useCallback(async (id: string) => {
    console.log(`[ChatScreen] Attempting to fetch messages for workspaceId: ${id}`);
    setIsLoadingMessages(true);
    setMessageError(null);
    try {
      const fetchedMessages = await getConversationMessages(id);
      setMessages(fetchedMessages);
      console.log(`[ChatScreen] Successfully fetched ${fetchedMessages.length} messages.`);
    } catch (err: any) {
      console.error('[ChatScreen] Failed to fetch messages:', err);
      setMessageError(err.message || 'Failed to load messages.');
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (workspaceName) {
      navigation.setOptions({ title: decodeURIComponent(workspaceName) });
    } else if (workspaceId) {
      navigation.setOptions({ title: `Chat (${workspaceId.substring(0, 5)}...)` }); 
    } else {
      navigation.setOptions({ title: 'Chat' });
    }
  }, [navigation, workspaceId, workspaceName]);

  useEffect(() => {
    if (workspaceId) {
      fetchMessages(workspaceId);
    } else {
      setMessages([]);
      setMessageError('Workspace ID not provided. Cannot load messages.');
      console.log('[ChatScreen] No workspaceId provided, clearing messages.');
    }
  }, [workspaceId, fetchMessages]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || !workspaceId || isSendingMessage) return;

    const userMessage: AppMessage = {
      id: `local-${Date.now()}-${Math.random()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsSendingMessage(true);
    setMessageError(null);

    try {
      const confirmedUserMessage = await sendConversationMessage(workspaceId, currentInput);
      // APIからの応答でメッセージリストを更新
      // 送信したユーザーメッセージをサーバーからの応答(確定版)で置き換える
      setMessages(prevMessages => 
        prevMessages.map(msg => msg.id === userMessage.id ? confirmedUserMessage : msg)
        .sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()) // 時系列ソート
      );
      // メッセージリスト全体を再取得して、ボットの応答などを反映
      await fetchMessages(workspaceId);
    } catch (err: any) {
      console.error('[ChatScreen] Failed to send message:', err);
      setMessageError(err.message || 'Failed to send message.');
      setMessages(prevMessages => prevMessages.filter(m => m.id !== userMessage.id));
    } finally {
      setIsSendingMessage(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessageItem = ({ item }: { item: AppMessage }) => {
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

  if (isLoadingMessages && messages.length === 0) { 
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.onBackground }}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[componentStyles.container, { backgroundColor: theme.colors.background }]} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} 
      >
        <View style={componentStyles.messageContainer}>
          {messageError && (
            <View style={{ padding: 10, backgroundColor: theme.colors.errorContainer, alignItems: 'center', margin:10, borderRadius: theme.roundness }}>
              <Text style={{ color: theme.colors.onError }}>Error: {messageError}</Text>
            </View>
          )}
          {isLoadingMessages && messages.length > 0 && (
             <View style={{ padding: 10, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={theme.colors.primary} />             
             </View>
          )}
          {!messageError && messages.length === 0 && !isLoadingMessages && (
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
               <Text style={{color: theme.colors.onSurfaceVariant}}>No messages yet. Start the conversation!</Text>
             </View>
          )}
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
            editable={!isSendingMessage}
          />
          <IconButton
            icon="send"
            size={24}
            iconColor={theme.colors.primary}
            onPress={handleSendMessage}
            style={componentStyles.sendButton}
            disabled={inputText.trim() === '' || !workspaceId || isSendingMessage}
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
