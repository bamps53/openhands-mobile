import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // アイコンライブラリ
import { theme } from '../../src/theme/theme'; // アプリのテーマ

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled, 
        tabBarStyle: {
          backgroundColor: theme.colors.card, // タブバーの背景色
          borderTopColor: theme.colors.border, // タブバーの上枠線
        },
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          // fontWeight: theme.typography.h2.fontWeight, // Consider adding if defined in theme
          // fontSize: theme.typography.h2.fontSize,   // Consider adding if defined in theme
        },
      }}>
      <Tabs.Screen
        name="index" // app/(tabs)/index.tsx を参照
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerShown: false, // ホーム画面では独自のヘッダーを使用するため、タブのヘッダーは非表示
        }}
      />
      <Tabs.Screen
        name="chat" // app/(tabs)/chat.tsx を参照
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="files" // app/(tabs)/files.tsx を参照
        options={{
          title: 'Files',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder-open-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="terminal" // app/(tabs)/terminal.tsx を参照
        options={{
          title: 'Terminal',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="console-line" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
