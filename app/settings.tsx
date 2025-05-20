import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { List, Switch, Divider, useTheme, MD3Theme, Text, Button, Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// TODO: Replace with actual version from package.json or build config
const APP_VERSION = '0.1.0-alpha';

export default function SettingsScreen() {
  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme);
  const router = useRouter();

  // Mock states for settings
  const [isDarkTheme, setIsDarkTheme] = useState(theme.dark); // Or manage theme globally
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggleTheme = () => {
    // In a real app, this would dispatch an action to change the theme
    setIsDarkTheme(!isDarkTheme);
    Alert.alert("テーマ変更", isDarkTheme ? "ライトテーマに切り替えます (モック)" : "ダークテーマに切り替えます (モック)");
    // Potentially: themeManager.setTheme(isDarkTheme ? 'light' : 'dark');
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert("通知設定", notificationsEnabled ? "通知をオフにしました (モック)" : "通知をオンにしました (モック)");
  };

  const handleClearCache = () => {
    Alert.alert(
      "キャッシュをクリア",
      "アプリケーションのキャッシュをクリアしてもよろしいですか？ (モック)",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "クリア", onPress: () => console.log("Cache cleared (mock)") }
      ]
    );
  };
  
  const handleServerConfiguration = () => {
    // Navigate to a dedicated server configuration screen or show a modal
    // For now, just an alert.
    // router.push('/server-config'); // Example navigation
    Alert.alert("サーバー設定", "サーバー設定画面へ (モック)");
  };

  const handleLogout = () => {
    Alert.alert(
      "ログアウト",
      "ログアウトしてもよろしいですか？",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "ログアウト", onPress: () => {
            console.log("User logged out (mock)");
            // Perform actual logout logic here (e.g., clear tokens, navigate to login)
            // For Expo Router, you might redirect to the initial route or a login screen
            // router.replace('/login'); or router.replace('/');
             Alert.alert("ログアウトしました", "（モック）ログイン画面に戻ります。");
             // Assuming server-connection is the entry or login screen
             router.replace('/server-connection'); 
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Appbar.Header
        style={{ backgroundColor: theme.colors.surface }}
        elevated={true}
      >
        <Appbar.Content title="設定" titleStyle={{color: theme.colors.onSurface}} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <List.Section title="一般設定">
          <List.Item
            title="サーバー設定"
            description="接続先サーバーの情報を変更します"
            left={props => <List.Icon {...props} icon="server-network" />}
            onPress={handleServerConfiguration}
          />
          <List.Item
            title="テーマ"
            description={isDarkTheme ? "ダークモード" : "ライトモード"}
            left={props => <List.Icon {...props} icon={isDarkTheme ? "weather-night" : "weather-sunny"} />}
            right={() => (
              <Switch value={isDarkTheme} onValueChange={handleToggleTheme} />
            )}
            onPress={handleToggleTheme} // Allow pressing the whole item
          />
          <List.Item
            title="通知"
            description={notificationsEnabled ? "オン" : "オフ"}
            left={props => <List.Icon {...props} icon={notificationsEnabled ? "bell" : "bell-off"} />}
            right={() => (
              <Switch value={notificationsEnabled} onValueChange={handleToggleNotifications} />
            )}
            onPress={handleToggleNotifications}
          />
        </List.Section>

        <Divider />

        <List.Section title="データ管理">
          <List.Item
            title="キャッシュをクリア"
            description="一時ファイルを削除して空き容量を増やします"
            left={props => <List.Icon {...props} icon="cached" />}
            onPress={handleClearCache}
          />
        </List.Section>

        <Divider />

        <List.Section title="アプリ情報">
          <List.Item
            title="バージョン"
            description={APP_VERSION}
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
           <List.Item
            title="ライセンス"
            description="オープンソースライセンス情報を表示"
            left={props => <List.Icon {...props} icon="license" />}
            onPress={() => Alert.alert("ライセンス情報", "ライセンス情報を表示します (モック)")} // Placeholder
          />
        </List.Section>

        <Divider />

        <View style={styles.logoutButtonContainer}>
          <Button
            icon="logout"
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonText}
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
          >
            ログアウト
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    logoutButtonContainer: {
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    logoutButton: {
      // elevation: 2, // if using mode="elevated"
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
