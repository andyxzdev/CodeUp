import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { api } from "../../api/config";
import useAuth from "../../hooks/useAuth";

export default function UserProfileScreen({ route, navigation }) {
  // ==========================
  // 🚨 Proteção contra params indefinidos
  // ==========================
  const params = route?.params;
  const id = params?.id;

  const { usuario } = useAuth();

  // ==========================
  // 🚨 Se tentar abrir o próprio perfil → redireciona
  // ==========================
  useEffect(() => {
    if (usuario && id === usuario.id) {
      navigation.replace("MyProfile");
    }
  }, [usuario, id]);

  const [perfil, setPerfil] = useState(null);
  const [posts, setPosts] = useState([]);
  const [jaSegue, setJaSegue] = useState(false);

  useEffect(() => {
    if (!id) return;
    carregarPerfil();
    carregarPosts();
  }, [id]);

  // ======================
  // CARREGAR PERFIL
  // ======================
  const carregarPerfil = async () => {
    try {
      const res = await api.get(`/usuarios/${id}`);

      if (res?.sucesso) {
        setPerfil(res.dados);
      }
    } catch (e) {
      console.log("Erro ao carregar perfil:", e);
    }
  };

  // ======================
  // CARREGAR POSTS
  // ======================
  const carregarPosts = async () => {
    try {
      const res = await api.get(`/publicacoes/usuario/${id}`);

      if (res?.sucesso) {
        setPosts(res.dados);
      }
    } catch (e) {
      console.log("Erro ao carregar posts:", e);
    }
  };

  // ======================
  // SEGUIR USUÁRIO
  // ======================
  const seguir = async () => {
    if (!usuario || !id) return;

    if (usuario.id === id) {
      return Alert.alert("Ops", "Você não pode seguir você mesmo!");
    }

    if (jaSegue) {
      return Alert.alert("Aviso", "Você já segue este usuário");
    }

    try {
      const res = await api.post(`/usuarios/${id}/seguir`);

      if (res?.sucesso) {
        Alert.alert("Sucesso", "Agora você segue este usuário!");
        setJaSegue(true);
        carregarPerfil();
      }
    } catch (error) {
      console.log("Erro ao seguir:", error);
    }
  };

  // ======================
  // NAVEGAR PARA CHAT
  // ======================
  const enviarMensagem = () => {
    if (!perfil) return;

    navigation.navigate("Chat", {
      usuarioId: id,
      nome: perfil.nome,
    });
  };

  if (!perfil) return <Text>Carregando perfil...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{perfil.nome}</Text>
      <Text style={styles.email}>{perfil.email}</Text>

      {/* BOTÃO SEGUIR */}
      <TouchableOpacity
        style={[styles.botao, jaSegue && { backgroundColor: "#999" }]}
        onPress={seguir}
      >
        <Text style={styles.botaoTxt}>{jaSegue ? "Seguindo" : "Seguir"}</Text>
      </TouchableOpacity>

      {/* BOTÃO MENSAGEM */}
      <TouchableOpacity style={styles.botaoSec} onPress={enviarMensagem}>
        <Text style={styles.botaoTxt}>Enviar Mensagem</Text>
      </TouchableOpacity>

      <Text style={styles.section}>Publicações:</Text>

      {/* LISTA DE POSTS */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text>{item.conteudo}</Text>
            <Text style={styles.date}>{item.createdAt}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  nome: { fontSize: 22, fontWeight: "bold" },
  email: { color: "#555", marginBottom: 20 },
  botao: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  botaoSec: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  botaoTxt: { color: "#fff", fontWeight: "bold" },
  section: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  post: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginBottom: 10,
  },
  date: { fontSize: 12, color: "#777", marginTop: 4 },
});
