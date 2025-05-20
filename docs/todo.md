## MVP実装 機能取り込み TODOリスト

以下に、`external/openhands-mobile` から現行プロジェクトに取り込むべき機能のTODOリストを記載します。Expo SDKのバージョン差異を考慮し、各機能のポーティングには調整が必要となる点にご留意ください。

### 認証・接続
- [x] **サーバー接続機能 (`ServerConnectionScreen`)**
    - [x] サーバーURL入力UIの実装 (基本部分)
    - [x] サーバーへの接続テスト処理 (API連携)
    - [x] 接続状態の管理と表示 (Reduxストア `authSlice` 参照)
    - [x] 接続成功後の画面遷移 (例: ホーム画面へ)
    - [x] APIクライアントの初期化 (`api/client.ts` `initializeApiClient` 参照) (雛形作成)

### メイン機能
- [ ] **ホーム画面 (`HomeScreen`)**
    - [ ] ワークスペース一覧表示 (API連携)
    - [ ] ワークスペース検索機能
    - [ ] 新規ワークスペース作成機能 (UIとAPI連携)
    - [ ] ワークスペース選択時の会話画面への遷移

- [ ] **会話画面 (`ConversationScreen`)**
    - [ ] タブUIの再構築 (Chat, Files, Terminal)
    - [ ] **チャット機能 (Chatタブ)**
        - [ ] メッセージ送受信UI ( `ChatInput` コンポーネント参照)
        - [ ] メッセージ履歴表示
        - [ ] AIとのメッセージング処理 (API連携)
    - [ ] **ファイルブラウザ機能 (Filesタブ)**
        - [ ] `FileBrowserScreen` のポーティングと統合
        - [ ] ファイル/ディレクトリ一覧表示 (API連携)
        - [ ] ディレクトリ操作 (移動、パンくず)
        - [ ] ファイル内容表示 (API連携)
    - [ ] **ターミナル機能 (Terminalタブ)**
        - [ ] `TerminalScreen` のポーティングと統合
        - [ ] コマンド入力と実行 (API連携)
        - [ ] コマンド出力表示
        - [ ] 特殊キー入力の対応 (必要に応じて)

### UI/UX改善 (既存実装からの検討事項)
- [ ] `react-native-paper` コンポーネントの互換性確認と適用
- [x] テーマ (`src/theme/theme.ts`) の適用と調整
- [ ] `SafeAreaProvider` 等による表示領域の調整

### その他
- [x] Reduxストア (`src/store`) の設計と、既存スライスの移行・統合
    - [x] `authSlice` など
- [x] API通信処理 (`src/api`) のポーティングと現行プロジェクトへの統合
    - [x] APIクライアント (`client.ts`) (雛形作成)
    - [ ] 型定義 (`types.ts`)
- [ ] 古いExpo SDK依存のコードのアップデート・置き換え
