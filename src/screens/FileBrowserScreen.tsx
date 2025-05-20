import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { IconButton } from 'react-native-paper';
import { FileItem } from '../api/types';

// 仮のファイルデータ
const MOCK_FILES: FileItem[] = [
  { name: 'src', path: '/src', type: 'directory' },
  { name: 'components', path: '/src/components', type: 'directory' },
  { name: 'Button.js', path: '/src/components/Button.js', type: 'file' },
  { name: 'Header.js', path: '/src/components/Header.js', type: 'file' },
  { name: 'index.js', path: '/src/components/index.js', type: 'file' },
  { name: 'utils', path: '/src/utils', type: 'directory' },
  { name: 'App.js', path: '/src/App.js', type: 'file' },
];

// 仮のファイル内容
const MOCK_FILE_CONTENT = `import React from 'react';
import PropTypes from 'prop-types';

const Button = (props) => {
  return (
    <button>
      {props.children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node
}

export default Button;
`;

interface FileBrowserProps {
  workspaceId: string;
}

const FileBrowserScreen: React.FC<FileBrowserProps> = ({ workspaceId }) => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['src']);

  // ファイル一覧の取得（実際の実装ではAPIを呼び出す）
  useEffect(() => {
    // 仮のデータを使用
    const filteredFiles = MOCK_FILES.filter(file => {
      if (currentPath === '/') {
        return file.path.split('/').length === 2 && file.path !== '/';
      }
      const pathParts = file.path.split('/');
      const currentParts = currentPath.split('/');
      return pathParts.length === currentParts.length + 1 && 
             file.path.startsWith(currentPath);
    });
    
    setFiles(filteredFiles);
  }, [currentPath, workspaceId]);

  // ファイル内容の取得（実際の実装ではAPIを呼び出す）
  const fetchFileContent = (file: FileItem) => {
    // 仮のデータを使用
    setFileContent(MOCK_FILE_CONTENT);
    setSelectedFile(file);
  };

  // ファイルまたはディレクトリの選択
  const handleSelectItem = (item: FileItem) => {
    if (item.type === 'directory') {
      setCurrentPath(item.path);
      setBreadcrumbs(item.path.split('/').filter(p => p));
    } else {
      fetchFileContent(item);
    }
  };

  // 親ディレクトリに戻る
  const handleGoBack = () => {
    if (currentPath === '/') return;
    
    const pathParts = currentPath.split('/');
    pathParts.pop();
    const newPath = pathParts.join('/') || '/';
    setCurrentPath(newPath);
    setBreadcrumbs(newPath.split('/').filter(p => p));
  };

  // パンくずリストの特定の場所に移動
  const navigateToBreadcrumb = (index: number) => {
    if (index < 0) {
      setCurrentPath('/');
      setBreadcrumbs([]);
      return;
    }
    
    const newPath = '/' + breadcrumbs.slice(0, index + 1).join('/');
    setCurrentPath(newPath);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  // ファイルアイテムのレンダリング
  const renderFileItem = ({ item }: { item: FileItem }) => (
    <TouchableOpacity 
      style={styles.fileItem}
      onPress={() => handleSelectItem(item)}
    >
      <IconButton
        icon={item.type === 'directory' ? 'folder' : 'file-document-outline'}
        size={24}
        iconColor={item.type === 'directory' ? '#FFC107' : '#2196F3'}
      />
      <Text style={styles.fileName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // パンくずリストのレンダリング
  const renderBreadcrumbs = () => (
    <View style={styles.breadcrumbs}>
      <TouchableOpacity onPress={() => navigateToBreadcrumb(-1)}>
        <Text style={styles.breadcrumbItem}>src</Text>
      </TouchableOpacity>
      
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Text style={styles.breadcrumbSeparator}> › </Text>}
          <TouchableOpacity onPress={() => navigateToBreadcrumb(index)}>
            <Text style={styles.breadcrumbItem}>{crumb}</Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderBreadcrumbs()}
      
      <View style={styles.contentContainer}>
        <View style={styles.fileListContainer}>
          {currentPath !== '/' && (
            <TouchableOpacity 
              style={styles.fileItem}
              onPress={handleGoBack}
            >
              <IconButton
                icon="arrow-up"
                size={24}
                iconColor="#757575"
              />
              <Text style={styles.fileName}>..</Text>
            </TouchableOpacity>
          )}
          
          <FlatList
            data={files}
            renderItem={renderFileItem}
            keyExtractor={item => item.path}
          />
        </View>
        
        {selectedFile && (
          <View style={styles.fileContentContainer}>
            <View style={styles.fileHeader}>
              <Text style={styles.fileTitle}>{selectedFile.name}</Text>
            </View>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{fileContent}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexWrap: 'wrap',
  },
  breadcrumbItem: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  breadcrumbSeparator: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fileListContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#EEEEEE',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  fileName: {
    fontSize: 16,
  },
  fileContentContainer: {
    flex: 2,
  },
  fileHeader: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  fileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  codeContainer: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: '#FAFAFA',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
});

export default FileBrowserScreen;
