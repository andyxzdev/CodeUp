import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./pages/Login/LoginScreen";
import HomeScreen from "./pages/home/HomeScreen";
import ProfileScreen from "./pages/profile/ProfileScreen";
import NotificationsScreen from "./pages/Notifications/NotificationsScreen";
import ChatScreen from "./pages/Messages/ChatScreen";
import ConversasScreen from "./pages/Messages/ConversasScreen";
import NovaMensagemScreen from "./pages/Messages/NovaMensagemScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "CodeUp - Home" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Perfil", headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen} // ← Agora vai funcionar!
          options={{ title: "Notificações" }}
        />
        <Stack.Screen
          name="Search"
          component={HomeScreen} // Temporário - mesma tela
          options={{ title: "Pesquisar" }}
        />
        <Stack.Screen
          name="CreatePost"
          component={HomeScreen} // Temporário - mesma tela
          options={{ title: "Criar Publicação" }}
        />
        <Stack.Screen
          name="Messages"
          component={ConversasScreen}
          options={{ title: "Mensagens" }}
        />
        <Stack.Screen
          name="NovaMensagem"
          component={NovaMensagemScreen}
          options={{ title: "Nova Mensagem" }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
