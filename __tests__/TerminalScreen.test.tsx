import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TerminalScreen from '../src/screens/TerminalScreen';

describe('TerminalScreen', () => {
  const mockWorkspaceId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial command history', () => {
    const { getByText } = render(
      <TerminalScreen workspaceId={mockWorkspaceId} />
    );

    // 初期コマンド履歴が表示されることを確認
    expect(getByText('user@openhands:~$ ls')).toBeTruthy();
    expect(getByText('Documents  Downloads  Pictures  Videos')).toBeTruthy();
    expect(getByText('user@openhands:~$ cd Documents')).toBeTruthy();
    expect(getByText('user@openhands:~/Documents$ nano notes.txt')).toBeTruthy();
    expect(getByText('user@openhands:~/Documents$')).toBeTruthy();
  });

  it('allows entering and executing commands', () => {
    const { getByPlaceholderText, getByText } = render(
      <TerminalScreen workspaceId={mockWorkspaceId} />
    );

    // コマンドを入力
    const input = getByPlaceholderText('');
    fireEvent.changeText(input, 'ls');
    
    // Enterキーを押してコマンドを実行
    fireEvent(input, 'submitEditing');
    
    // コマンドとその結果が表示されることを確認
    expect(getByText('user@openhands:~/Documents$ ls')).toBeTruthy();
    expect(getByText('notes.txt  project.md  data.csv')).toBeTruthy();
  });

  it('handles cd command correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <TerminalScreen workspaceId={mockWorkspaceId} />
    );

    // cdコマンドを実行
    const input = getByPlaceholderText('');
    fireEvent.changeText(input, 'cd ..');
    fireEvent(input, 'submitEditing');
    
    // プロンプトのパスが変更されることを確認
    expect(getByText('user@openhands:~$')).toBeTruthy();
  });

  it('handles pwd command correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <TerminalScreen workspaceId={mockWorkspaceId} />
    );

    // pwdコマンドを実行
    const input = getByPlaceholderText('');
    fireEvent.changeText(input, 'pwd');
    fireEvent(input, 'submitEditing');
    
    // 現在のパスが表示されることを確認
    expect(getByText('/home/user/Documents')).toBeTruthy();
  });

  it('handles cat command correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <TerminalScreen workspaceId={mockWorkspaceId} />
    );

    // catコマンドを実行
    const input = getByPlaceholderText('');
    fireEvent.changeText(input, 'cat notes.txt');
    fireEvent(input, 'submitEditing');
    
    // ファイル内容が表示されることを確認
    expect(getByText('This is the content of notes.txt.')).toBeTruthy();
    expect(getByText('It contains some example text.')).toBeTruthy();
  });

  it('handles help command correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <TerminalScreen workspaceId={mockWorkspaceId} />
    );

    // helpコマンドを実行
    const input = getByPlaceholderText('');
    fireEvent.changeText(input, 'help');
    fireEvent(input, 'submitEditing');
    
    // ヘルプメッセージが表示されることを確認
    expect(getByText('Available commands: ls, cd, cat, pwd, clear, help')).toBeTruthy();
  });

  it('handles clear command correctly', () => {
    const { getByPlaceholderText, queryByText } = render(
      <TerminalScreen workspaceId={mockWorkspaceId} />
    );

    // clearコマンドを実行
    const input = getByPlaceholderText('');
    fireEvent.changeText(input, 'clear');
    fireEvent(input, 'submitEditing');
    
    // 履歴がクリアされることを確認
    expect(queryByText('user@openhands:~$ ls')).toBeNull();
  });

  it('handles unknown commands correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <TerminalScreen workspaceId={mockWorkspaceId} />
    );

    // 不明なコマンドを実行
    const input = getByPlaceholderText('');
    fireEvent.changeText(input, 'unknown');
    fireEvent(input, 'submitEditing');
    
    // エラーメッセージが表示されることを確認
    expect(getByText('Command not found: unknown')).toBeTruthy();
  });

  it('renders special keys correctly', () => {
    const { getByText } = render(
      <TerminalScreen workspaceId={mockWorkspaceId} />
    );

    // 特殊キーが表示されることを確認
    expect(getByText('Tab')).toBeTruthy();
    expect(getByText('Ctrl')).toBeTruthy();
    expect(getByText('Alt')).toBeTruthy();
    expect(getByText('↑')).toBeTruthy();
    expect(getByText('↓')).toBeTruthy();
    expect(getByText('←')).toBeTruthy();
    expect(getByText('→')).toBeTruthy();
  });
});
