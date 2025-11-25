import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      {/* Telas específicas com header */}

      <Stack.Screen
        name="home" // nome do arquivo/tela que ta no app
        options={{
          headerShown: true,
          headerTitle: "Voltar", // Android
          headerBackTitle: "Voltar", // iOS
          headerStyle: styles.barraHeader, // Estilo do container
          headerTitleStyle: styles.titulo, // Estilo do texto
          headerTintColor: "#FFF", // Cor do ícone/botão de voltar
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{ headerTitle: "Notificação" }}
      />
      <Stack.Screen name="config" options={{ headerTitle: "Configuração" }} />
      <Stack.Screen
        name="config/Terms"
        options={{ headerTitle: "Termos & Politicas" }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  barraHeader: {
    backgroundColor: "#250E03",
  },
  titulo: {
    color: "#FFF",
    fontSize: 18,
  },
});
