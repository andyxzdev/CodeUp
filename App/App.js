import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./pages/Login/LoginScreen";
import CadastroScreen from "./pages/Login/CadastroScreen";
import HomeScreen from "./pages/home/HomeScreen";
import UserProfileScreen from "./pages/profile/UserProfileScreen";
import MyProfileScreen from "./pages/profile/MyProfileScreen";
import NotificationsScreen from "./pages/notifications/NotificationsScreen";
import ChatScreen from "./pages/Messages/ChatScreen";
import ConversasScreen from "./pages/Messages/ConversasScreen";
import NovaMensagemScreen from "./pages/Messages/NovaMensagemScreen";
import CreatePostScreen from "./pages/post/CreatePostScreen";
import SearchUserScreen from "./pages/search/SearchUserScreen";
import EditProfileScreen from "./pages/profile/EditProfileScreen";

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
          name="Cadastro"
          component={CadastroScreen}
          options={{ title: "Criar Conta" }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "CodeUp - Home" }}
        />
        <Stack.Screen
          name="Profile"
          component={UserProfileScreen}
          options={{ title: "Perfil", headerShown: false }}
        />

        <Stack.Screen
          name="MyProfile"
          component={MyProfileScreen}
          options={{ title: "Meu Perfil" }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen} // ← Agora vai funcionar!
          options={{ title: "Notificações" }}
        />
        <Stack.Screen
          name="Search"
          component={SearchUserScreen}
          options={{ title: "Pesquisar Usuário" }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{ title: "Nova Publicação" }}
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

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: "Editar Perfil" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
