// App/App.js
import React from "react";
import { View } from "react-native";
import LoginScreen from "./pages/Login/LoginScreen";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <LoginScreen />
    </View>
  );
}
