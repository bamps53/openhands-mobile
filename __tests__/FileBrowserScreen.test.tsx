import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FileBrowserScreen from '../src/screens/FileBrowserScreen';

describe('FileBrowserScreen', () => {
  const mockWorkspaceId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial file list', () => {
    const { getByText } = render(
      <FileBrowserScreen workspaceId={mockWorkspaceId} />
    );

    // パンくずリストが表示されることを確認
    expect(getByText('src')).toBeTruthy();
    
    // 初期ファイルリストが表示されることを確認
    expect(getByText('components')).toBeTruthy();
    expect(getByText('utils')).toBeTruthy();
    expect(getByText('App.js')).toBeTruthy();
  });

  it('navigates to subdirectory when directory is clicked', () => {
    const { getByText, queryByText } = render(
      <FileBrowserScreen workspaceId={mockWorkspaceId} />
    );

    // componentsディレクトリをクリック
    fireEvent.press(getByText('components'));
    
    // パンくずリストが更新されることを確認
    expect(getByText('components')).toBeTruthy();
    
    // サブディレクトリのファイルが表示されることを確認
    expect(getByText('Button.js')).toBeTruthy();
    expect(getByText('Header.js')).toBeTruthy();
    expect(getByText('index.js')).toBeTruthy();
    
    // 他のファイルが表示されないことを確認
    expect(queryByText('utils')).toBeNull();
    expect(queryByText('App.js')).toBeNull();
  });

  it('displays file content when file is clicked', () => {
    const { getByText } = render(
      <FileBrowserScreen workspaceId={mockWorkspaceId} />
    );

    // componentsディレクトリをクリック
    fireEvent.press(getByText('components'));
    
    // Button.jsファイルをクリック
    fireEvent.press(getByText('Button.js'));
    
    // ファイル内容が表示されることを確認
    expect(getByText('Button.js')).toBeTruthy();
    expect(getByText(/import React from 'react'/)).toBeTruthy();
    expect(getByText(/const Button = \(props\) => {/)).toBeTruthy();
  });

  it('navigates back to parent directory', () => {
    const { getByText, queryByText } = render(
      <FileBrowserScreen workspaceId={mockWorkspaceId} />
    );

    // componentsディレクトリをクリック
    fireEvent.press(getByText('components'));
    
    // 戻るボタン(..)をクリック
    fireEvent.press(getByText('..'));
    
    // ルートディレクトリのファイルが表示されることを確認
    expect(getByText('components')).toBeTruthy();
    expect(getByText('utils')).toBeTruthy();
    expect(getByText('App.js')).toBeTruthy();
    
    // サブディレクトリのファイルが表示されないことを確認
    expect(queryByText('Button.js')).toBeNull();
  });

  it('navigates using breadcrumbs', () => {
    const { getByText, queryByText } = render(
      <FileBrowserScreen workspaceId={mockWorkspaceId} />
    );

    // componentsディレクトリをクリック
    fireEvent.press(getByText('components'));
    
    // パンくずリストのsrcをクリック
    fireEvent.press(getByText('src'));
    
    // ルートディレクトリのファイルが表示されることを確認
    expect(getByText('components')).toBeTruthy();
    expect(getByText('utils')).toBeTruthy();
    expect(getByText('App.js')).toBeTruthy();
    
    // サブディレクトリのファイルが表示されないことを確認
    expect(queryByText('Button.js')).toBeNull();
  });
});
