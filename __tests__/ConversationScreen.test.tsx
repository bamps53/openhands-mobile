import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ConversationScreen from '../src/screens/ConversationScreen';

// ナビゲーションのモック
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// ルートパラメータのモック
const mockRoute = {
  params: {
    workspaceId: '1',
    workspaceName: 'Test Workspace',
  },
};

describe('ConversationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with tabs', () => {
    const { getByText } = render(
      <ConversationScreen navigation={mockNavigation} route={mockRoute} />
    );

    // ヘッダーとタブが表示されることを確認
    expect(getByText('OpenHands')).toBeTruthy();
    expect(getByText('Chat')).toBeTruthy();
    expect(getByText('Files')).toBeTruthy();
    expect(getByText('Terminal')).toBeTruthy();
  });

  it('displays initial chat messages', () => {
    const { getByText } = render(
      <ConversationScreen navigation={mockNavigation} route={mockRoute} />
    );

    // 初期メッセージが表示されることを確認
    expect(getByText('Hello!')).toBeTruthy();
    expect(getByText('Hi there! How can I assist you today?')).toBeTruthy();
    expect(getByText("What's the weather like today?")).toBeTruthy();
    expect(getByText('The weather is partly cloudy with a chance of rain later in the afternoon.')).toBeTruthy();
  });

  it('allows sending new messages', () => {
    const { getByPlaceholderText, getByText } = render(
      <ConversationScreen navigation={mockNavigation} route={mockRoute} />
    );

    // メッセージを入力して送信
    fireEvent.changeText(getByPlaceholderText('Message'), 'Test message');
    fireEvent.press(getByText('send'));

    // 送信したメッセージが表示されることを確認
    expect(getByText('Test message')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(
      <ConversationScreen navigation={mockNavigation} route={mockRoute} />
    );

    // 戻るボタンをタップ
    fireEvent.press(getByTestId('arrow-left'));
    
    // 戻る関数が呼び出されることを確認
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('shows placeholder for Files tab', () => {
    const { getByText } = render(
      <ConversationScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Filesタブをタップ
    fireEvent.press(getByText('Files'));
    
    // プレースホルダーが表示されることを確認
    expect(getByText('Files functionality will be implemented here')).toBeTruthy();
  });

  it('shows placeholder for Terminal tab', () => {
    const { getByText } = render(
      <ConversationScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Terminalタブをタップ
    fireEvent.press(getByText('Terminal'));
    
    // プレースホルダーが表示されることを確認
    expect(getByText('Terminal functionality will be implemented here')).toBeTruthy();
  });
});
