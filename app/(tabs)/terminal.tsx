import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme, MD3Theme, IconButton, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// HTML content for the WebView
// Note: In a real app, you might load this from a static file or a server.
// For simplicity, it's embedded here. Ensure `xterm.css`, `xterm.js`, and `addon-fit.js`
// are accessible, e.g., via CDN if not bundled.
const terminalHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.css" />
    <style>
        html, body, #terminal-container {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #1e1e1e;
        }
    </style>
</head>
<body>
    <div id="terminal-container"></div>

    <script src="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.js"></script>
    
    <script>
        const terminalContainer = document.getElementById('terminal-container');
        const term = new Terminal({
            cursorBlink: true,
            fontFamily: 'monospace',
            fontSize: 14,
            theme: {
                background: '#1e1e1e',
                foreground: '#cccccc',
                cursor: '#cccccc',
            },
            allowProposedApi: true // Enable if needed for certain features or addons
        });
        const fitAddon = new FitAddon.FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalContainer);
        
        function fitTerminal() {
          fitAddon.fit();
          // Ensure terminal has correct dimensions, especially on orientation change or initial load
          term.scrollToBottom();
        }

        fitTerminal();
        window.addEventListener('resize', fitTerminal);

        // Communication with React Native
        // RN -> WebView
        window.addEventListener('message', event => {
            try {
                const msgData = JSON.parse(event.data);
                if (msgData.type === 'command' && msgData.payload) {
                    // Echo command to terminal for user to see
                    term.write('\\r\\n$ ' + msgData.payload + '\\r\\n');
                    
                    // Mock command processing (can be expanded)
                    // In a real app, this would likely involve sending the command 
                    // to a backend or processing it client-side if it's a local command.
                    let response = '';
                    const command = msgData.payload.trim().toLowerCase();
                    if (command === 'hello') {
                        response = 'Hello from xterm.js in OpenHands Mobile App!\\r\\n';
                    } else if (command === 'date') {
                        response = new Date().toUTCString() + '\\r\\n';
                    } else if (command === 'ls') {
                        response = 'README.md  node_modules/  package.json\\r\\n';
                    } else if (command.startsWith('echo ')) {
                        response = msgData.payload.substring(5) + '\\r\\n';
                    }
                     else {
                        response = 'Unknown command: ' + msgData.payload + '\\r\\n';
                    }
                    term.write(response);
                    term.write('$ '); // New prompt
                } else if (msgData.type === 'clear_terminal') {
                    term.clear();
                    term.write('Terminal Cleared.\\r\\n$ ');
                }
            } catch (e) {
                // term.write('Error processing message: ' + e.message);
            }
        });

        // WebView -> RN (example: sending output or events back)
        term.onData(data => {
             // You might want to send data back to RN if the PTY/shell itself is sending data
             // For now, we are handling input from RN TextInput and echoing in WebView.
            // Example:
            // if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            //     window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'terminal_output', payload: data }));
            // }
        });
        
        term.write('Welcome to OpenHands Mobile Terminal!\\r\\n');
        term.write('Type "hello", "date", "ls", or "echo [text]"\\r\\n');
        term.write('$ ');
        term.focus(); // Focus the terminal on load
    </script>
</body>
</html>
`;

const PROMPT = '$ ';

export default function TerminalScreen() {
  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme);
  const webViewRef = useRef<WebView>(null);
  const [currentCommand, setCurrentCommand] = useState<string>('');

  const handleSendCommand = () => {
    if (currentCommand.trim() === '' || !webViewRef.current) return;

    if (currentCommand.trim().toLowerCase() === 'clear') {
        webViewRef.current.postMessage(JSON.stringify({ type: 'clear_terminal' }));
    } else {
        webViewRef.current.postMessage(JSON.stringify({ type: 'command', payload: currentCommand }));
    }
    setCurrentCommand('');
  };

  // Function to handle messages from WebView (if needed in the future)
  // const onWebViewMessage = (event: any) => {
  //   const data = JSON.parse(event.nativeEvent.data);
  //   if (data.type === 'terminal_output') {
  //     // Process output from terminal if necessary
  //     console.log('Output from terminal:', data.payload);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? (theme.isV3 ? 90 : 60) : 0}
      >
        <View style={styles.webViewContainer}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: terminalHtml, baseUrl: '' }} // baseUrl is important for some relative paths if any
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            // onMessage={onWebViewMessage} // Enable if you need to receive messages from WebView
            onLoadEnd={() => webViewRef.current?.requestFocus()} // Attempt to focus webview content
          />
        </View>

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
            // Prompt is now handled inside the WebView's xterm instance
            // left={<TextInput.Affix text={PROMPT} textStyle={[styles.outputText, styles.promptAffix]} />}
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
      backgroundColor: theme.colors.background, // Use theme background
    },
    webViewContainer: {
      flex: 1,
    },
    webView: {
      flex: 1,
      backgroundColor: '#1e1e1e', // Match terminal background
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
    // Removed unused styles like outputText, promptAffix etc.
    // Add new styles if needed for WebView container or other elements
  });
