import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatInput from '../src/components/ChatInput';

// Audio APIのモック
jest.mock('expo-av', () => ({
  Audio: {
    Recording: jest.fn().mockImplementation(() => ({
      prepareToRecordAsync: jest.fn().mockResolvedValue({}),
      startAsync: jest.fn().mockResolvedValue({}),
      stopAndUnloadAsync: jest.fn().mockResolvedValue({}),
      getURI: jest.fn().mockReturnValue('file://test/audio.m4a'),
    })),
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    setAudioModeAsync: jest.fn().mockResolvedValue({}),
    RecordingOptionsPresets: {
      HIGH_QUALITY: {},
    },
  },
}));

// Speech APIのモック
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

describe('ChatInput', () => {
  const mockSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with microphone icon', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ChatInput onSendMessage={mockSendMessage} />
    );

    // 入力フィールドとマイクアイコンが表示されることを確認
    expect(getByPlaceholderText('Message')).toBeTruthy();
    expect(getByTestId('microphone')).toBeTruthy();
  });

  it('allows text input and sends message', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ChatInput onSendMessage={mockSendMessage} />
    );

    // テキストを入力
    fireEvent.changeText(getByPlaceholderText('Message'), 'Hello world');
    
    // 送信ボタンをクリック
    fireEvent.press(getByTestId('send'));
    
    // onSendMessageが呼び出されることを確認
    expect(mockSendMessage).toHaveBeenCalledWith('Hello world');
  });

  it('toggles recording state when microphone is pressed', async () => {
    const { getByTestId, queryByTestId } = render(
      <ChatInput onSendMessage={mockSendMessage} />
    );

    // 初期状態ではマイクアイコンが表示される
    expect(getByTestId('microphone')).toBeTruthy();
    expect(queryByTestId('microphone-off')).toBeNull();
    
    // マイクボタンをクリック
    fireEvent.press(getByTestId('microphone'));
    
    // 録音中状態になり、マイクオフアイコンが表示される
    await waitFor(() => {
      expect(queryByTestId('microphone')).toBeNull();
      expect(getByTestId('microphone-off')).toBeTruthy();
    });
    
    // もう一度マイクボタンをクリック
    fireEvent.press(getByTestId('microphone-off'));
    
    // 録音停止状態になり、マイクアイコンが表示される
    await waitFor(() => {
      expect(getByTestId('microphone')).toBeTruthy();
      expect(queryByTestId('microphone-off')).toBeNull();
    });
  });

  it('simulates speech recognition after recording stops', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <ChatInput onSendMessage={mockSendMessage} />
    );

    // マイクボタンをクリックして録音開始
    fireEvent.press(getByTestId('microphone'));
    
    // マイクオフボタンをクリックして録音停止
    await waitFor(() => {
      expect(getByTestId('microphone-off')).toBeTruthy();
    });
    
    fireEvent.press(getByTestId('microphone-off'));
    
    // 音声認識中のメッセージが表示される
    await waitFor(() => {
      expect(getByPlaceholderText('Message').props.value).toBe('音声を認識中...');
    });
    
    // 2秒後に認識結果が表示される
    await waitFor(() => {
      expect(getByPlaceholderText('Message').props.value).toBe('音声入力によるメッセージです。');
    }, { timeout: 3000 });
  });
});
