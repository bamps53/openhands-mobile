# OpenHands モバイルアプリ デプロイ手順書

## 1. 開発環境のセットアップ

### 1.1 必要なツール

- Node.js (v18以上)
- npm (v8以上)
- Expo CLI
- Git
- Android Studio (Androidビルド用)
- Xcode (iOSビルド用、macOSのみ)

### 1.2 リポジトリのクローン

```bash
git clone https://github.com/your-username/openhands-mobile.git
cd openhands-mobile
```

### 1.3 依存関係のインストール

```bash
npm install
```

## 2. 開発モードでの実行

### 2.1 Expoサーバーの起動

```bash
npx expo start
```

### 2.2 デバイスでのテスト

- iOSデバイス: Expo Goアプリをインストールし、QRコードをスキャン
- Androidデバイス: Expo Goアプリをインストールし、QRコードをスキャン
- エミュレータ/シミュレータ: 開発サーバーのメニューから選択

## 3. 本番ビルド

### 3.1 Expo EASのセットアップ

```bash
npm install -g eas-cli
eas login
```

### 3.2 ビルド設定

```bash
eas build:configure
```

### 3.3 Androidビルド

```bash
eas build -p android
```

### 3.4 iOSビルド

```bash
eas build -p ios
```

## 4. アプリストアへの公開

### 4.1 App Store (iOS)

1. Apple Developer Programに登録
2. App Store Connectでアプリを作成
3. 以下のコマンドでビルドと提出を実行

```bash
eas submit -p ios
```

### 4.2 Google Play Store (Android)

1. Google Play Developer Consoleに登録
2. 新しいアプリを作成
3. 以下のコマンドでビルドと提出を実行

```bash
eas submit -p android
```

## 5. 設定とカスタマイズ

### 5.1 サーバーURLの設定

デフォルトのサーバーURLを変更する場合は、`src/api/config.ts`ファイルを編集します：

```typescript
export const DEFAULT_SERVER_URL = 'https://your-openhands-server.com';
```

### 5.2 テーマのカスタマイズ

アプリのテーマカラーを変更する場合は、`src/theme/theme.ts`ファイルを編集します。

### 5.3 アプリアイコンとスプラッシュスクリーン

- アプリアイコン: `assets/icon.png`を置き換え
- スプラッシュスクリーン: `assets/splash.png`を置き換え

変更後、以下のコマンドを実行：

```bash
npx expo prebuild
```

## 6. トラブルシューティング

### 6.1 ビルドエラー

- 依存関係の問題: `npm install`を再実行
- キャッシュの問題: `npx expo start --clear`を実行

### 6.2 接続エラー

- サーバーURLが正しいか確認
- ネットワーク接続を確認
- サーバーが稼働しているか確認

### 6.3 その他の問題

詳細なログを取得するには：

```bash
npx expo start --verbose
```

## 7. サポートとリソース

- Expo ドキュメント: https://docs.expo.dev/
- React Native ドキュメント: https://reactnative.dev/docs/
- OpenHands ドキュメント: https://docs.all-hands.dev/
