import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/store/authSlice';
import HomeScreen from '../src/screens/HomeScreen';

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
    preloadedState: {
      auth: {
        isConnected: true,
        serverConfig: { url: 'http://test-server.com' },
      },
    },
  });
};

describe('HomeScreen', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // 主要なUI要素が存在することを確認
    expect(getByText('OpenHands')).toBeTruthy();
    expect(getByPlaceholderText('Search')).toBeTruthy();
    
    // デフォルトのワークスペースが表示されることを確認
    expect(getByText('Design Team')).toBeTruthy();
    expect(getByText('Marketing Project')).toBeTruthy();
    expect(getByText('Client A Workspace')).toBeTruthy();
    expect(getByText('Development')).toBeTruthy();
    expect(getByText('Research')).toBeTruthy();
  });

  it('filters workspaces based on search query', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // 検索クエリを入力
    fireEvent.changeText(getByPlaceholderText('Search'), 'Design');
    
    // 検索結果を確認
    expect(getByText('Design Team')).toBeTruthy();
    expect(queryByText('Marketing Project')).toBeNull();
    expect(queryByText('Client A Workspace')).toBeNull();
    expect(queryByText('Development')).toBeTruthy(); // "Development" contains "Design"
    expect(queryByText('Research')).toBeNull();
  });

  it('navigates to conversation screen when workspace is selected', () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // ワークスペースをタップ
    fireEvent.press(getByText('Design Team'));
    
    // 正しい画面に遷移することを確認
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Conversation', {
      workspaceId: '1',
      workspaceName: 'Design Team',
    });
  });

  it('clears search results when query is empty', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // 検索クエリを入力
    fireEvent.changeText(getByPlaceholderText('Search'), 'Design');
    
    // 検索結果を確認
    expect(queryByText('Marketing Project')).toBeNull();
    
    // 検索クエリをクリア
    fireEvent.changeText(getByPlaceholderText('Search'), '');
    
    // すべてのワークスペースが表示されることを確認
    expect(getByText('Design Team')).toBeTruthy();
    expect(getByText('Marketing Project')).toBeTruthy();
    expect(getByText('Client A Workspace')).toBeTruthy();
    expect(getByText('Development')).toBeTruthy();
    expect(getByText('Research')).toBeTruthy();
  });
});
