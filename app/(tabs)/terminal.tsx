import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Text as RNText, // react-native Text for output lines
} from 'react-native';
import { Text, useTheme, MD3Theme, IconButton, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OutputLine {
  id: string;
  text: string;
  type: 'command' | 'response' | 'error' | 'system'; // Added 'system' type
}

const PROMPT = '$ ';

export default function TerminalScreen() {
  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme);

  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [outputLines]);

  useEffect(() => {
    setOutputLines([
      { id: `sys-${Date.now()}`, text: 'OpenHands Mobile Terminal Connected.', type: 'system' },
      { id: `sys-${Date.now()+1}`, text: 'Type "help" for a list of available mock commands.', type: 'system' },
    ]);
  }, []);

  const handleSendCommand = () => {
    if (currentCommand.trim() === '') return;

    const commandToSend = currentCommand;
    const newCommandOutput: OutputLine = {
      id: `cmd-${Date.now()}`,
      text: `${PROMPT}${commandToSend}`,
      type: 'command',
    };
    
    setOutputLines(prevLines => [...prevLines, newCommandOutput]);
    setCurrentCommand('');

    let responseText: string;
    let responseType: 'response' | 'error' = 'response';

    switch (commandToSend.toLowerCase().trim()) {
      case 'help':
        responseText = [
          'Available mock commands:',
          '  help          - Show this help message',
          '  ls            - List mock files and directories',
          '  date          - Show current date and time',
          '  echo [text]   - Echoes back the provided text',
          '  clear         - Clear the terminal screen',
          '  error_test    - Simulate an error',
        ].join('\n');
        break;
      case 'ls':
        responseText = 'README.md   node_modules/   package.json   src/';
        break;
      case 'date':
        responseText = new Date().toUTCString();
        break;
      case 'clear':
        setOutputLines([
            { id: `sys-${Date.now()}`, text: 'Terminal cleared.', type: 'system'}
        ]);
        return;
      case 'error_test':
        responseText = 'This is a simulated error message.';
        responseType = 'error';
        break;
      default:
        if (commandToSend.toLowerCase().startsWith('echo ')) {
            responseText = commandToSend.substring(5);
        } else {
            responseText = `command not found: ${commandToSend}`;
            responseType = 'error';
        }
        break;
    }

    const newResponseOutput: OutputLine = {
      id: `res-${Date.now()}`,
      text: responseText,
      type: responseType,
    };
    
    setTimeout(() => {
        setOutputLines(prevLines => [...prevLines, newResponseOutput]);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? (theme.isV3 ? 90 : 60) : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.outputContainer}
          contentContainerStyle={styles.outputContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {outputLines.map(line => (
            <RNText
              key={line.id}
              selectable
              style={[
                styles.outputText,
                line.type === 'command' && styles.commandText,
                line.type === 'response' && styles.responseText,
                line.type === 'error' && styles.errorText,
                line.type === 'system' && styles.systemText,
              ]}
            >
              {line.text}
            </RNText>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={currentCommand}
            onChangeText={setCurrentCommand}
            placeholder="Type command..."
            mode="flat"
            dense
            onSubmitEditing={handleSendCommand}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            left={<TextInput.Affix text={PROMPT} textStyle={[styles.outputText, styles.promptAffix]} />}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            textColor={theme.colors.onSurface}
            theme={{ colors: { onSurfaceVariant: theme.colors.onSurfaceDisabled } }}
          />
          <IconButton
            icon="send"
            size={24}
            iconColor={theme.colors.primary}
            onPress={handleSendCommand}
            disabled={currentCommand.trim() === ''}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.elevation.level0,
    },
    outputContainer: {
      flex: 1,
      paddingHorizontal: 12,
      paddingTop: 8,
      backgroundColor: theme.colors.elevation.level0, 
    },
    outputContentContainer: {
      paddingBottom: 8,
    },
    outputText: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.onSurface, 
    },
    commandText: {
    },
    responseText: {
    },
    errorText: {
      color: theme.colors.error,
    },
    systemText: {
      color: theme.colors.onSurfaceVariant,
      fontStyle: 'italic',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: Platform.OS === 'ios' ? 10 : 8,
      backgroundColor: theme.colors.elevation.level2,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.outlineVariant,
    },
    textInput: {
      flex: 1,
      marginRight: 8,
      backgroundColor: 'transparent',
      paddingVertical: Platform.OS === 'ios' ? 8 : 0,
      fontSize: 14,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    promptAffix: {
      color: theme.colors.primary,
      marginRight: 4,
    },
  });
