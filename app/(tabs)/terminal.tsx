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
import axios from 'axios'; // Import axios for error type checking
import { executeCommand } from '../../src/api/client';
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
      { id: `sys-${Date.now()}`, text: 'OpenHands Remote Terminal Connected.', type: 'system' },
      { id: `sys-${Date.now()+1}`, text: 'Enter commands to execute on the remote server.', type: 'system' },
    ]);
  }, []);

  const handleSendCommand = async () => { // Make the function async
    if (currentCommand.trim() === '') return;

    const commandToSend = currentCommand;
    const newCommandOutput: OutputLine = {
      id: `cmd-${Date.now()}`,
      text: `${PROMPT}${commandToSend}`,
      type: 'command',
    };
    
    setOutputLines(prevLines => [...prevLines, newCommandOutput]);
    setCurrentCommand('');

    // Client-side 'clear'
    if (commandToSend.toLowerCase().trim() === 'clear') {
      setOutputLines([
        { id: `sys-${Date.now()}`, text: 'Terminal cleared.', type: 'system' }
      ]);
      return;
    }

    // Client-side "help" message (Option A)
    if (commandToSend.toLowerCase().trim() === 'help') {
      const helpMessage: OutputLine = {
        id: `sys-${Date.now()}`,
        text: "You are connected to a remote terminal. Enter any standard shell command for the server environment. There are no specific client-side commands other than 'clear'.",
        type: 'system',
      };
      setOutputLines(prevLines => [...prevLines, helpMessage]);
      // The command "help" will still be sent to the server.
    }

    let responseText: string;
    let responseType: 'response' | 'error' = 'response';

    try {
      const serverResponse = await executeCommand(commandToSend);

      if (serverResponse.stderr && serverResponse.stderr.trim() !== '') {
        responseText = serverResponse.stderr;
        responseType = 'error';
      } else if (serverResponse.stdout) {
        responseText = serverResponse.stdout;
        if (serverResponse.exit_code !== 0) {
            responseType = 'error'; 
        }
      } else {
        responseText = ''; // No output
        if (serverResponse.exit_code !== 0) {
            responseType = 'error';
            responseText = `Command exited with code ${serverResponse.exit_code}`;
        } else {
            responseText = '[command executed successfully with no output]';
        }
      }

    } catch (error: any) {
      if (axios.isAxiosError(error)) { // Check if it's an Axios error
        if (error.response) {
          // Server responded with an error status code (4xx, 5xx)
          responseText = `Server error: ${error.response.status} ${error.response.data?.message || error.response.data?.detail || error.message || 'An unexpected error occurred on the server.'}`;
        } else if (error.request) {
          // Request was made but no response received (e.g., network error)
          responseText = 'Network error. Please check your connection and server address.';
        } else {
          // Something else happened setting up the request
          responseText = `Error: ${error.message || 'Failed to send command to server.'}`;
        }
      } else {
        // Non-Axios error
        responseText = `Error: ${error.message || 'An unknown error occurred.'}`;
      }
      responseType = 'error';
    }

    const newResponseOutput: OutputLine = {
      id: `res-${Date.now()}`,
      text: responseText,
      type: responseType,
    };
    
    setOutputLines(prevLines => [...prevLines, newResponseOutput]);
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
