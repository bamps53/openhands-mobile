import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { theme } from './theme/theme';
import ServerConnectionScreen from './screens/ServerConnectionScreen';
import HomeScreen from './screens/HomeScreen';
import ConversationScreen from './screens/ConversationScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ServerConnection"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ServerConnection" component={ServerConnectionScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Conversation" component={ConversationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
