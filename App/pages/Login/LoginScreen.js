// App/pages/Login/LoginScreen.js - ATUALIZADO COM NAVEGAÇÃO
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { authService } from "../../api/authService.js";

export default function LoginScreen({ navigation }) {
  // 🔥 ADICIONAR navigation como prop
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    setCarregando(true);
    try {
      console.log("🔐 Tentando login...", email);

      const resultado = await authService.login(email, senha);

      Alert.alert("Sucesso", `Bem-vindo, ${resultado.usuario.nome}!`);
      console.log("✅ Login realizado:", resultado.usuario.nome);

      // 🔥 ADICIONAR NAVEGAÇÃO PARA HOME APÓS LOGIN
      console.log("🎯 Navegando para Home...");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erro no Login", error.message);
      console.error("❌ Erro no login:", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CodeUp</Text>
      <Text style={styles.subtitle}>Faça login na sua conta</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={carregando}
        style={[styles.loginButton, carregando && styles.loginButtonDisabled]}
      >
        <Text style={styles.loginButtonText}>
          {carregando ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#007AFF",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: "#ccc",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
