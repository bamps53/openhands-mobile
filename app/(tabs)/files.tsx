import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native'; 
import { List, Text, useTheme, MD3Theme, Divider, ActivityIndicator, Appbar } from 'react-native-paper'; 
import { SafeAreaView } from 'react-native-safe-area-context';

interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string; 
  children?: FileSystemNode[]; 
  content?: string; 
  size?: number; 
  lastModified?: string; 
}

const mockRootFileSystem: FileSystemNode[] = [
  { id: '1', name: 'src', type: 'folder', path: '/src', children: [
    { id: '1-1', name: 'components', type: 'folder', path: '/src/components', children: [
      { id: '1-1-1', name: 'Button.tsx', type: 'file', path: '/src/components/Button.tsx', content: '// Button component code...' },
      { id: '1-1-2', name: 'Card.tsx', type: 'file', path: '/src/components/Card.tsx', content: '// Card component code...' },
    ]},
    { id: '1-2', name: 'screens', type: 'folder', path: '/src/screens', children: [
      { id: '1-2-1', name: 'HomeScreen.tsx', type: 'file', path: '/src/screens/HomeScreen.tsx', content: '// HomeScreen code...' },
    ]},
    { id: '1-3', name: 'App.tsx', type: 'file', path: '/src/App.tsx', content: '// Main App component code...' },
  ]},
  { id: '2', name: 'public', type: 'folder', path: '/public', children: [
    { id: '2-1', name: 'index.html', type: 'file', path: '/public/index.html', content: '<!DOCTYPE html>...' },
    { id: '2-2', name: 'favicon.ico', type: 'file', path: '/public/favicon.ico' },
  ]},
  { id: '3', name: 'package.json', type: 'file', path: '/package.json', content: '{ "name": "my-app", ... }' },
  { id: '4', name: 'README.md', type: 'file', path: '/README.md', content: '# My Awesome App' },
];

export default function FilesScreen() {
  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme);

  const [currentPath, setCurrentPath] = useState<string>('/'); 
  const [currentNodes, setCurrentNodes] = useState<FileSystemNode[]>(mockRootFileSystem); 
  const [selectedFile, setSelectedFile] = useState<FileSystemNode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pathHistory, setPathHistory] = useState<string[]>([]); 

  const findNodesByPath = (path: string, nodes: FileSystemNode[]): FileSystemNode[] | undefined => {
    if (path === '/') return mockRootFileSystem; 
    
    const parts = path.split('/').filter(p => p); 
    let currentLevelNodes: FileSystemNode[] | undefined = nodes;

    for (const part of parts) {
      const foundNode: FileSystemNode | undefined = currentLevelNodes?.find(node => node.name === part && node.type === 'folder');
      if (foundNode && foundNode.children) {
        currentLevelNodes = foundNode.children;
      } else {
        return undefined; 
      }
    }
    return currentLevelNodes;
  };
  
  useEffect(() => {
    setLoading(true);
    const nodesForPath = findNodesByPath(currentPath, mockRootFileSystem);
    setCurrentNodes(nodesForPath || []);
    setLoading(false);
    setSelectedFile(null);
  }, [currentPath]);

  const handlePressItem = (item: FileSystemNode) => {
    if (item.type === 'folder') {
      setPathHistory(prev => [...prev, currentPath]);
      setCurrentPath(item.path);
    } else {
      setSelectedFile(item);
    }
  };

  const handleGoBack = () => {
    if (pathHistory.length > 0) {
      const previousPath = pathHistory[pathHistory.length - 1];
      setPathHistory(prev => prev.slice(0, -1));
      setCurrentPath(previousPath);
    } else if (currentPath !== '/') {
        const pathParts = currentPath.split('/').filter(p => p);
        if (pathParts.length > 1) {
            setCurrentPath('/' + pathParts.slice(0, -1).join('/'));
        } else {
            setCurrentPath('/');
        }
    }
  };
  
  const getFileIcon = (type: 'file' | 'folder', name: string) => {
    if (type === 'folder') return 'folder-outline';
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tsx': case 'jsx': case 'ts': case 'js': return 'language-javascript';
      case 'json': return 'code-json';
      case 'md': return 'language-markdown';
      case 'png': case 'jpg': case 'jpeg': case 'gif': return 'file-image-outline';
      default: return 'file-document-outline';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ActivityIndicator animating={true} size="large" style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  if (selectedFile) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => setSelectedFile(null)} />
          <Appbar.Content title={selectedFile.name} titleStyle={styles.appBarTitleFixed} />
        </Appbar.Header>
        <ScrollView style={styles.fileContentContainer}>
          <Text style={styles.fileContentText}>{selectedFile.content || 'No content available or file is binary.'}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Appbar.Header style={styles.appBar}>
        {currentPath !== '/' && (
          <Appbar.Action icon="arrow-left" onPress={handleGoBack} />
        )}
        <Appbar.Content 
          title={currentPath === '/' ? 'Files' : currentPath.split('/').pop() || 'Files'} 
          subtitle={currentPath === '/' ? 'Root directory' : `Path: ${currentPath}`}
          titleStyle={styles.appBarTitle}
          subtitleStyle={styles.appBarSubtitle}
        />
      </Appbar.Header>
      <FlatList
        data={currentNodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            titleStyle={styles.listItemTitle}
            left={props => <List.Icon {...props} icon={getFileIcon(item.type, item.name)} color={item.type === 'folder' ? theme.colors.primary : theme.colors.onSurfaceVariant} />}
            onPress={() => handlePressItem(item)}
            style={styles.listItem}
            description={item.type === 'folder' ? `${(item.children?.length || 0)} items` : (item.size ? `${item.size} bytes` : undefined)}
            descriptionStyle={styles.listItemDescription}
          />
        )}
        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: theme.colors.outlineVariant }}/>}
        ListEmptyComponent={<Text style={styles.emptyText}>This folder is empty.</Text>}
      />
    </SafeAreaView>
  );
}

const makeStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  appBar: {
    backgroundColor: theme.colors.surface, 
  },
  appBarTitle: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: theme.colors.onSurface,
  },
  appBarTitleFixed: { 
    fontSize: 18, 
    color: theme.colors.onSurface,
  },
  appBarSubtitle: {
    fontSize: 12, 
    color: theme.colors.onSurfaceVariant,
  },
  listItem: {
    paddingVertical: 4, 
    backgroundColor: theme.colors.surface, 
  },
  listItemTitle: {
    fontSize: 16, 
    color: theme.colors.onSurface,
  },
  listItemDescription: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  fileContentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.surfaceVariant, 
  },
  fileContentText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
});
