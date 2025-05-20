import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { theme } from '../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, FAB } from 'react-native-paper';
import { Workspace } from '../api/types';

// 仮のデータ
const MOCK_WORKSPACES: Workspace[] = [
  { id: '1', name: 'Design Team', last_updated: '2h ago' },
  { id: '2', name: 'Marketing Project', last_updated: '3h ago' },
  { id: '3', name: 'Client A Workspace', last_updated: '3h ago' },
  { id: '4', name: 'Development', last_updated: '3h ago' },
  { id: '5', name: 'Research', last_updated: 'day ago' },
];

const HomeScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(MOCK_WORKSPACES);
  const { serverConfig } = useSelector((state: RootState) => state.auth);

  // 検索機能
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setWorkspaces(MOCK_WORKSPACES);
    } else {
      const filtered = MOCK_WORKSPACES.filter(workspace => 
        workspace.name.toLowerCase().includes(query.toLowerCase())
      );
      setWorkspaces(filtered);
    }
  };

  // 新規ワークスペース作成
  const handleCreateWorkspace = () => {
    // TODO: 新規ワークスペース作成画面に遷移
    console.log('Create new workspace');
  };

  // ワークスペース選択
  const handleSelectWorkspace = (workspace: Workspace) => {
    // TODO: 選択したワークスペースの詳細画面に遷移
    navigation.navigate('Conversation', { workspaceId: workspace.id, workspaceName: workspace.name });
  };

  // ワークスペースアイテムのレンダリング
  const renderWorkspaceItem = ({ item }: { item: Workspace }) => (
    <TouchableOpacity 
      style={styles.workspaceCard}
      onPress={() => handleSelectWorkspace(item)}
    >
      <Text style={styles.workspaceName}>{item.name}</Text>
      <Text style={styles.workspaceLastUpdated}>Last updated {item.last_updated}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>OpenHands</Text>
      </View>
      
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        data={workspaces}
        renderItem={renderWorkspaceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.workspaceList}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleCreateWorkspace}
        color="#FFFFFF"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.m,
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: theme.spacing.s,
  },
  searchBar: {
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    elevation: 0,
    backgroundColor: theme.colors.backgroundLight,
  },
  workspaceList: {
    padding: theme.spacing.m,
  },
  workspaceCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  workspaceName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  workspaceLastUpdated: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default HomeScreen;
