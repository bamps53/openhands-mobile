import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { theme } from '../theme/theme';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // メッセージ送信
  const handleSend = () => {
    if (message.trim() === '') return;
    
    onSendMessage(message);
    setMessage('');
  };

  // 録音開始
  const startRecording = async () => {
    try {
      // 音声録音の許可を取得
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('音声録音の許可が必要です');
        return;
      }

      // 録音設定
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 録音開始
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('録音開始エラー:', error);
    }
  };

  // 録音停止と音声認識
  const stopRecording = async () => {
    if (!recording) return;

    try {
      // 録音停止
      await recording.stopAndUnloadAsync();
      setIsRecording(false);

      // 録音ファイルのURI取得
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        // ここで音声認識APIを呼び出す
        // 実際のアプリでは、Google Speech-to-Text APIやAzure Speech ServicesなどのAPIを使用
        // このサンプルでは、仮のテキストを返す
        simulateSpeechToText();
      }
    } catch (error) {
      console.error('録音停止エラー:', error);
    }
  };

  // 音声認識のシミュレーション（実際のアプリではAPIを使用）
  const simulateSpeechToText = () => {
    // 音声認識中の表示
    setMessage('音声を認識中...');
    
    // 2秒後に仮のテキストを表示（実際のアプリではAPIレスポンスを使用）
    setTimeout(() => {
      const recognizedText = '音声入力によるメッセージです。';
      setMessage(recognizedText);
    }, 2000);
  };

  // マイクボタンの処理
  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <View style={styles.buttonContainer}>
        <IconButton
          icon={isRecording ? "microphone-off" : "microphone"}
          size={24}
          onPress={handleMicPress}
          style={[
            styles.micButton,
            isRecording && styles.recordingButton
          ]}
          iconColor={isRecording ? "#FFFFFF" : theme.colors.primary}
          testID={isRecording ? "microphone-off" : "microphone"}
        />
        <IconButton
          icon="send"
          size={24}
          onPress={handleSend}
          style={styles.sendButton}
          iconColor={theme.colors.primary}
          testID="send"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.s,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 20,
    maxHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micButton: {
    marginLeft: theme.spacing.s,
  },
  recordingButton: {
    backgroundColor: theme.colors.error,
  },
  sendButton: {
    marginLeft: theme.spacing.s,
  },
});

export default ChatInput;
