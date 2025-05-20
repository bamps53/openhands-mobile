import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/store/authSlice';
import ServerConnectionScreen from '../src/screens/ServerConnectionScreen';
import * as apiClient from '../src/api/client';

// APIクライアントのモック
jest.mock('../src/api/client', () => ({
  testServerConnection: jest.fn(),
  initializeApiClient: jest.fn(),
}));

// ナビゲーションのモック
const mockNavigation = {
  navigate: jest.fn(),
};

// テスト用のストアを作成
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('ServerConnectionScreen', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <ServerConnectionScreen navigation={mockNavigation} />
      </Provider>
    );

    // 主要なUI要素が存在することを確認
    expect(getByText('Server Connection')).toBeTruthy();
    expect(getByText('Server URL')).toBeTruthy();
    expect(getByPlaceholderText('https://example.com')).toBeTruthy();
    expect(getByText('Connect')).toBeTruthy();
    expect(getByText('Status')).toBeTruthy();
  });

  it('handles empty URL input', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ServerConnectionScreen navigation={mockNavigation} />
      </Provider>
    );

    // 空のURLで接続ボタンをクリック
    fireEvent.press(getByText('Connect'));
    
    // APIが呼び出されないことを確認
    expect(apiClient.testServerConnection).not.toHaveBeenCalled();
  });

  it('handles successful connection', async () => {
    // 成功するAPIレスポンスをモック
    apiClient.testServerConnection.mockResolvedValue(true);
    
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <ServerConnectionScreen navigation={mockNavigation} />
      </Provider>
    );

    // URLを入力
    fireEvent.changeText(getByPlaceholderText('https://example.com'), 'http://test-server.com');
    
    // 接続ボタンをクリック
    fireEvent.press(getByText('Connect'));
    
    // APIが正しく呼び出されることを確認
    expect(apiClient.testServerConnection).toHaveBeenCalledWith('http://test-server.com');
    
    // 成功時の処理を確認
    await waitFor(() => {
      expect(apiClient.initializeApiClient).toHaveBeenCalledWith({ url: 'http://test-server.com' });
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('handles connection failure', async () => {
    // 失敗するAPIレスポンスをモック
    apiClient.testServerConnection.mockResolvedValue(false);
    
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <ServerConnectionScreen navigation={mockNavigation} />
      </Provider>
    );

    // URLを入力
    fireEvent.changeText(getByPlaceholderText('https://example.com'), 'http://invalid-server.com');
    
    // 接続ボタンをクリック
    fireEvent.press(getByText('Connect'));
    
    // 失敗時のエラーメッセージを確認
    await waitFor(() => {
      expect(getByText('サーバーに接続できませんでした。URLを確認してください。')).toBeTruthy();
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  it('handles connection error', async () => {
    // エラーをスローするAPIレスポンスをモック
    apiClient.testServerConnection.mockRejectedValue(new Error('Network error'));
    
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <ServerConnectionScreen navigation={mockNavigation} />
      </Provider>
    );

    // URLを入力
    fireEvent.changeText(getByPlaceholderText('https://example.com'), 'http://error-server.com');
    
    // 接続ボタンをクリック
    fireEvent.press(getByText('Connect'));
    
    // エラー時のメッセージを確認
    await waitFor(() => {
      expect(getByText('接続エラー: Network error')).toBeTruthy();
    });
  });

  it('normalizes URL without protocol', async () => {
    // 成功するAPIレスポンスをモック
    apiClient.testServerConnection.mockResolvedValue(true);
    
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <ServerConnectionScreen navigation={mockNavigation} />
      </Provider>
    );

    // プロトコルなしのURLを入力
    fireEvent.changeText(getByPlaceholderText('https://example.com'), 'test-server.com');
    
    // 接続ボタンをクリック
    fireEvent.press(getByText('Connect'));
    
    // プロトコルが追加されたURLでAPIが呼び出されることを確認
    expect(apiClient.testServerConnection).toHaveBeenCalledWith('http://test-server.com');
  });
});
