import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

// 型定義
type RootStackParamList = {
  Home: undefined;
  // 他の画面を追加
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 仮のホーム画面コンポーネント
const HomeScreen = () => (
  <Text>OpenHands Mobile App</Text>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'OpenHands' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
