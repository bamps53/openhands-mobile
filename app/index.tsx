import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../src/store';
import { fetchConversations } from '../src/store/conversationSlice';
import { Conversation } from '../src/api/client';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../src/theme/theme';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isConnected, serverUrl } = useSelector((state: RootState) => state.auth);
  const { 
    conversations, 
    status: conversationStatus, 
    error: conversationError 
  } = useSelector((state: RootState) => state.conversations);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isConnected && conversationStatus === 'idle') {
      dispatch(fetchConversations());
    }
  }, [isConnected, conversationStatus, dispatch]);

  const filteredWorkspaces = conversations.filter(workspace => 
    workspace.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWorkspacePress = (workspaceId: string) => {
    router.push(`/chat?workspaceId=${workspaceId}`);
  };

  const renderWorkspaceItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={styles.workspaceCard} onPress={() => handleWorkspacePress(item.conversation_id)}>
      <Text style={styles.workspaceTitle}>{item.title}</Text>
      <Text style={styles.workspaceTimestamp}>最終更新: {new Date(item.last_updated_at).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  const renderWorkspaceList = () => {
    if (!isConnected) {
        // ServerConnectionScreen にリダイレクト、またはここで接続を促すメッセージを表示
        // この例では、ServerConnectionScreenが表示されているはずなのでnullを返すか、
        // もしくは _layout.tsx で制御されていることを期待
        return <Text style={styles.infoText}>サーバーに接続していません。</Text>; 
    }

    if (conversationStatus === 'loading') {
      return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />;
    }

    if (conversationStatus === 'failed') {
      return <Text style={styles.errorText}>ワークスペースの読み込みに失敗しました: {conversationError}</Text>;
    }

    if (conversationStatus === 'succeeded') {
      if (!filteredWorkspaces || filteredWorkspaces.length === 0) {
        return <Text style={styles.infoText}>利用可能なワークスペースはありません。</Text>;
      }
      return (
        <FlatList
          data={filteredWorkspaces}
          renderItem={renderWorkspaceItem}
          keyExtractor={(item) => item.conversation_id}
          style={styles.workspaceList}
          contentContainerStyle={styles.workspaceListContent}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Workspaces</Text>
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search Workspaces..."
        placeholderTextColor={theme.colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {renderWorkspaceList()} 

      <Button 
        mode="contained" 
        style={styles.newWorkspaceButton}
        labelStyle={styles.newWorkspaceButtonText} // For text styling within react-native-paper Button
        onPress={() => { /* TODO: Implement new workspace creation */ }}
      >
        新規Workspace作成
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.m, //左右のパディング
    paddingTop: Platform.OS === 'android' ? theme.spacing.m : 0, // AndroidのみSafeAreaView対策で追加パディング
  },
  headerContainer: {
    paddingVertical: theme.spacing.m,
    alignItems: 'center', // 中央寄せ
  },
  headerTitle: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text,
  },
  searchInput: {
    height: 48,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.m,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  loader: {
    marginTop: theme.spacing.xl,
  },
  errorText: {
    marginTop: theme.spacing.m,
    color: theme.colors.error,
    textAlign: 'center',
    fontSize: theme.typography.body.fontSize,
  },
  infoText: {
    marginTop: theme.spacing.m,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  workspaceList: {
    flex: 1, // Take remaining space
  },
  workspaceListContent: {
    paddingBottom: theme.spacing.m, // Ensure last item is not hidden by button
  },
  workspaceCard: {
    backgroundColor: theme.colors.card, // or backgroundLight if cards need to be distinct
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1, // Optional: if cards need a border
    borderColor: theme.colors.border, // Optional
    // Shadow for cards (optional, platform-specific)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // for Android
  },
  workspaceTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  workspaceTimestamp: {
    fontSize: theme.typography.smallestText.fontSize,
    color: theme.colors.textSecondary,
  },
  newWorkspaceButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.s, // Adjusted padding for better appearance
    marginVertical: theme.spacing.m, // Margin top and bottom
  },
  newWorkspaceButtonText: {
    fontSize: theme.typography.h3.fontSize, // Matching buttonText from server-connection
    fontWeight: 'bold', // Matching buttonText from server-connection
    color: '#FFFFFF',
  },
});
