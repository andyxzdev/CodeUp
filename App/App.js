import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./pages/Login/LoginScreen";
import HomeScreen from "./pages/home/HomeScreen";
import ProfileScreen from "./pages/profile/ProfileScreen"; // Sua tela de perfil
import NotificationsScreen from "./pages/notifications/NotificationsScreen"; // Sua tela de notificações

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
          options={{ title: "Meu Perfil" }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: "Notificações" }}
        />
        {/* 🔥 ADICIONE ESTAS TELAS TEMPORÁRIAS */}
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
          component={HomeScreen} // Temporário - mesma tela
          options={{ title: "Mensagens" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
