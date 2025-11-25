import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { api } from "../../api/config";
import useAuth from "../../hooks/useAuth";

export default function MyProfileScreen({ navigation }) {
  const { usuario, logout } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    carregarPerfil();
    carregarPosts();
  }, []);

  const carregarPerfil = async () => {
    const res = await api.get(`/usuarios/${usuario.id}`);
    if (res?.sucesso) setPerfil(res.dados);
  };

  const carregarPosts = async () => {
    const res = await api.get(`/publicacoes/usuario/${usuario.id}`);
    if (res?.sucesso) setPosts(res.dados);
  };

  if (!perfil) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{perfil.nome}</Text>
      <Text style={styles.email}>{perfil.email}</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => Alert.alert("Em breve!", "Tela de editar perfil")}
      >
        <Text style={styles.botaoTxt}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSec} onPress={logout}>
        <Text style={styles.botaoTxt}>Sair</Text>
      </TouchableOpacity>

      <Text style={styles.section}>Minhas Publicações:</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text>{item.conteudo}</Text>
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
    alignItems: "center",
    marginBottom: 10,
  },
  botaoSec: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  botaoTxt: { color: "#fff", fontWeight: "bold" },
  section: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  post: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginBottom: 10,
  },
});
