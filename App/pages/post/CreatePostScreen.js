import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { api } from "../../api/config";

export default function CreatePostScreen({ navigation }) {
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);

  const criarPublicacao = async () => {
    if (!texto.trim()) {
      return Alert.alert("Erro", "Digite algo para publicar");
    }

    setCarregando(true);
    try {
      const res = await api.post("/publicacoes", {
        conteudo: texto,
      });

      if (res?.sucesso) {
        Alert.alert("Sucesso", "Publicação criada!");
        setTexto("");
        navigation.goBack(); // volta ao feed
      } else {
        Alert.alert("Erro", res.mensagem || "Não foi possível publicar");
      }
    } catch (e) {
      console.log("Erro ao criar publicação:", e);
      Alert.alert("Erro", "Falha ao criar publicação");
    }
    setCarregando(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Publicação</Text>

      <TextInput
        placeholder="No que você está pensando?"
        style={styles.input}
        multiline
        value={texto}
        onChangeText={setTexto}
      />

      <TouchableOpacity
        onPress={criarPublicacao}
        disabled={carregando}
        style={[styles.botao, carregando && { backgroundColor: "#999" }]}
      >
        <Text style={styles.botaoTxt}>
          {carregando ? "Publicando..." : "Publicar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 150,
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
