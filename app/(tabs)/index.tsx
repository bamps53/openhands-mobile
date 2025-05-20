import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button, Appbar, useTheme, MD3Theme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../src/store';
import { fetchConversations } from '../../src/store/conversationSlice';
import { Conversation } from '../../src/api/client';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isConnected, serverUrl } = useSelector((state: RootState) => state.auth);
  const { 
    conversations, 
    status: conversationStatus, 
    error: conversationError 
  } = useSelector((state: RootState) => state.conversations);
  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme);
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
      <Appbar.Header
        style={{ backgroundColor: theme.colors.surface }}
        elevated={true}
      >
        <Appbar.Content title="Workspaces" titleStyle={{color: theme.colors.onSurface}} />
        <Appbar.Action
          icon="cog-outline"
          color={theme.colors.onSurface}
          onPress={() => router.push('/settings')}
        />
      </Appbar.Header>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search Workspaces..."
        placeholderTextColor={theme.colors.onSurfaceVariant}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {renderWorkspaceList()} 

      <Button 
        mode="contained" 
        style={styles.newWorkspaceButton}
        labelStyle={styles.newWorkspaceButtonText} 
        onPress={() => { /* TODO: Implement new workspace creation */ }}
        textColor={theme.colors.onPrimary}
      >
        新規Workspace作成
      </Button>
    </SafeAreaView>
  );
}

const makeStyles = (theme: MD3Theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchInput: {
      height: 48,
      backgroundColor: theme.colors.elevation.level2,
      borderRadius: theme.roundness,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.colors.onSurface,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    loader: {
      marginTop: 24,
    },
    errorText: {
      marginTop: 16,
      color: theme.colors.error,
      textAlign: 'center',
      fontSize: 14,
      marginHorizontal: 16,
    },
    infoText: {
      marginTop: 16,
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    workspaceList: {
      flex: 1,
      paddingHorizontal: 16,
    },
    workspaceListContent: {
      paddingBottom: 16,
    },
    workspaceCard: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.roundness,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    workspaceTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
    },
    workspaceTimestamp: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    newWorkspaceButton: {
      borderRadius: theme.roundness,
      paddingVertical: 8,
      margin: 16,
    },
    newWorkspaceButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
