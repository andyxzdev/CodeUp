import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { api } from "../../api/config";
import useAuth from "../../hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function MyProfileScreen({ navigation }) {
  const { usuario } = useAuth();

  const [perfil, setPerfil] = useState(null);
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    carregarMeuPerfil();
  }, [usuario]);

  const carregarMeuPerfil = async () => {
    try {
      const res = await api.get(`/usuarios/${usuario.id}`);

      if (res?.sucesso) {
        setPerfil(res.dados);
      }

      const postsRes = await api.get(`/publicacoes/usuario/${usuario.id}`);
      if (postsRes?.sucesso) {
        setPosts(postsRes.dados);
      }
    } catch (e) {
      console.log("❌ Erro carregando meu perfil:", e);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando || !perfil) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ================= HEADER DO PERFIL ================== */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>
            {perfil.nome?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.nome}>{perfil.nome}</Text>
        <Text style={styles.email}>{perfil.email}</Text>

        {perfil.bio ? (
          <Text style={styles.bio}>{perfil.bio}</Text>
        ) : (
          <Text style={styles.bioVazia}>Sem bio cadastrada.</Text>
        )}

        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.botaoTxt}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* ================= LISTA DE POSTS ================== */}
      <Text style={styles.section}>Minhas publicações</Text>

      <FlatList
        data={posts}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postTxt}>{item.conteudo}</Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleString("pt-BR")}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // HEADER
  header: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "#007AFF",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarTxt: { color: "#fff", fontSize: 30, fontWeight: "bold" },
  nome: { marginTop: 10, fontSize: 22, fontWeight: "bold" },
  email: { color: "#555" },
  bio: { marginTop: 8, fontStyle: "italic", color: "#333" },
  bioVazia: { marginTop: 8, color: "#777", fontStyle: "italic" },

  botaoEditar: {
    marginTop: 15,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  botaoTxt: { color: "#fff", fontWeight: "bold" },

  // POSTS
  section: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  post: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  postTxt: { fontSize: 15, color: "#333" },
  date: { marginTop: 6, fontSize: 11, color: "#777" },
});
