// App/App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./pages/Login/LoginScreen";
import HomeScreen from "./pages/home/HomeScreen";

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
          options={{ headerShown: false }} // Login sem header
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "CodeUp - Home" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
