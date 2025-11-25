import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import useAuth from "../../hooks/useAuth";
import { api } from "../../api/config";

export default function EditProfileScreen({ navigation }) {
  const { usuario } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || "");
      setEmail(usuario.email || "");
      setBio(usuario.bio || "");
      setFotoPerfil(usuario.fotoPerfil || "");
    }
  }, [usuario]);

  const salvarAlteracoes = async () => {
    try {
      const payload = {
        nome,
        email,
        bio,
        fotoPerfil,
      };

      console.log("📤 Enviando atualização:", payload);

      const res = await api.put(`/usuarios/${usuario.id}/perfil`, payload);

      console.log("📥 Resposta update:", res);

      if (!res.sucesso) {
        Alert.alert("Erro", res.mensagem || "Falha ao atualizar perfil");
        return;
      }

      Alert.alert("Sucesso", "Perfil atualizado!");
      navigation.goBack();
    } catch (error) {
      console.log("❌ Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Falha ao salvar alterações.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {/* FOTO DE PERFIL */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Image
          source={
            fotoPerfil
              ? { uri: fotoPerfil }
              : require("../../../assets/user1.jpg")
          }
          style={styles.avatar}
        />
      </View>

      <Text style={styles.label}>URL da Foto</Text>
      <TextInput
        style={styles.input}
        placeholder="https://minha-foto.com/img.jpg"
        value={fotoPerfil}
        onChangeText={setFotoPerfil}
      />

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Seu email"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={bio}
        onChangeText={setBio}
        placeholder="Fale um pouco sobre você..."
      />

      <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#007AFF",
  },
});
