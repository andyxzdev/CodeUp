import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: true }} />

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
