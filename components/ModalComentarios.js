import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { comentarioService } from "../App/api/comentarioService";
import { useAuth } from "../App/hooks/useAuth";

export function ModalComentarios({ publicacaoId, onClose }) {
  const [comentarios, setComentarios] = useState([]);
  const [texto, setTexto] = useState("");
  const slideAnim = useState(new Animated.Value(500))[0];
  const { usuario } = useAuth();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    carregarComentarios();
  }, []);

  const carregarComentarios = async () => {
    const res = await comentarioService.listar(publicacaoId);

    if (res.sucesso) {
      setComentarios(res.dados);
    }
  };

  const enviarComentario = async () => {
    if (!texto.trim()) return;

    const res = await comentarioService.criar(publicacaoId, texto);

    if (res.sucesso) {
      setComentarios([...comentarios, res.dados]);
      setTexto("");
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.background} onPress={onClose} />

      <Animated.View
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Comentários</Text>

          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        {/* LISTA */}
        <FlatList
          data={comentarios}
          keyExtractor={(item) => item.id.toString()}
          style={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.comentarioItem}>
              <Text style={styles.autor}>{item.authorName}</Text>
              <Text style={styles.texto}>{item.conteudo}</Text>
            </View>
          )}
        />

        {/* INPUT */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escreva um comentário..."
              value={texto}
              onChangeText={setTexto}
            />
            <TouchableOpacity onPress={enviarComentario}>
              <Ionicons name="send" size={26} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  background: {
    flex: 1,
  },

  container: {
    height: "55%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  lista: {
    marginTop: 15,
  },

  comentarioItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  autor: {
    fontWeight: "bold",
    color: "#333",
  },

  texto: {
    marginTop: 3,
    color: "#555",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
  },
});
