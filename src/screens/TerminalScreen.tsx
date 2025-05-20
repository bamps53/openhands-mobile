import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme/theme';
import { IconButton } from 'react-native-paper';

interface TerminalScreenProps {
  workspaceId: string;
}

const TerminalScreen: React.FC<TerminalScreenProps> = ({ workspaceId }) => {
  const [commandHistory, setCommandHistory] = useState<string[]>([
    'user@openhands:~$ ls',
    'Documents  Downloads  Pictures  Videos',
    'user@openhands:~$ cd Documents',
    'user@openhands:~/Documents$ nano notes.txt',
    'user@openhands:~/Documents$'
  ]);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('~/Documents');

  // コマンド実行（実際の実装ではAPIを呼び出す）
  const executeCommand = (command: string) => {
    // 現在のコマンドを履歴に追加
    const newHistory = [...commandHistory, `user@openhands:${currentPath}$ ${command}`];
    
    // 仮の応答を生成（実際の実装ではサーバーからの応答を使用）
    let response = '';
    
    if (command.startsWith('ls')) {
      response = 'notes.txt  project.md  data.csv';
    } else if (command.startsWith('cd ')) {
      const newDir = command.substring(3);
      if (newDir === '..') {
        setCurrentPath('~');
      } else {
        setCurrentPath(`${currentPath}/${newDir}`);
      }
    } else if (command.startsWith('cat ')) {
      const fileName = command.substring(4);
      response = `This is the content of ${fileName}.\nIt contains some example text.`;
    } else if (command === 'pwd') {
      response = `/home/user${currentPath.replace('~', '')}`;
    } else if (command === 'help') {
      response = 'Available commands: ls, cd, cat, pwd, clear, help';
    } else if (command === 'clear') {
      setCommandHistory([]);
      setCurrentCommand('');
      return;
    } else {
      response = `Command not found: ${command}`;
    }
    
    // 応答がある場合は履歴に追加
    if (response) {
      newHistory.push(response);
    }
    
    setCommandHistory(newHistory);
    setCurrentCommand('');
  };

  // キーボードの特殊キー
  const specialKeys = [
    { label: 'Tab', onPress: () => setCurrentCommand(prev => prev + '    ') },
    { label: 'Ctrl', onPress: () => console.log('Ctrl pressed') },
    { label: 'Alt', onPress: () => console.log('Alt pressed') },
    { label: '↑', onPress: () => console.log('Up pressed') },
    { label: '↓', onPress: () => console.log('Down pressed') },
    { label: '←', onPress: () => console.log('Left pressed') },
    { label: '→', onPress: () => console.log('Right pressed') },
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.terminalOutput}>
        {commandHistory.map((line, index) => (
          <Text key={index} style={styles.terminalText}>
            {line}
          </Text>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <Text style={styles.promptText}>{`user@openhands:${currentPath}$`}</Text>
        <TextInput
          style={styles.commandInput}
          value={currentCommand}
          onChangeText={setCurrentCommand}
          onSubmitEditing={() => executeCommand(currentCommand)}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>
      
      <View style={styles.specialKeysContainer}>
        {specialKeys.map((key, index) => (
          <IconButton
            key={index}
            mode="contained"
            icon={() => <Text style={styles.specialKeyText}>{key.label}</Text>}
            onPress={key.onPress}
            style={styles.specialKey}
          />
        ))}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  terminalOutput: {
    flex: 1,
    padding: theme.spacing.m,
  },
  terminalText: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.s,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  promptText: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  commandInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: theme.spacing.s,
    height: 40,
  },
  specialKeysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.s,
    backgroundColor: '#333333',
  },
  specialKey: {
    backgroundColor: '#444444',
    margin: 2,
  },
  specialKeyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TerminalScreen;
