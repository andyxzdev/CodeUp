import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService } from "../../api/usuarioService";

export default function NovaMensagemScreen({ navigation }) {
  const { usuario: usuarioLogado } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregarUsuarios = useCallback(async () => {
    try {
      setCarregando(true);
      console.log("👥 Carregando lista de usuários...");

      if (!usuarioLogado) {
        Alert.alert("Erro", "Você precisa estar logado");
        setCarregando(false);
        return;
      }

      const response = await usuarioService.buscarUsuarios();
      console.log("📦 Usuários carregados:", response);

      let listaUsuarios = [];

      if (response.dados) {
        listaUsuarios = response.dados;
      } else if (Array.isArray(response)) {
        listaUsuarios = response;
      }

      const usuariosSemEu = listaUsuarios.filter(
        (usuario) => usuario.id !== usuarioLogado.id
      );

      setUsuarios(usuariosSemEu);
      setUsuariosFiltrados(usuariosSemEu);
    } catch (error) {
      console.error("❌ Erro ao carregar usuários:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários");
      setUsuarios([]);
      setUsuariosFiltrados([]);
    } finally {
      setCarregando(false);
    }
  }, [usuarioLogado]);

  useEffect(() => {
    if (pesquisa.trim() === "") {
      setUsuariosFiltrados(usuarios);
    } else {
      const filtrados = usuarios.filter(
        (usuario) =>
          usuario.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          usuario.email.toLowerCase().includes(pesquisa.toLowerCase())
      );
      setUsuariosFiltrados(filtrados);
    }
  }, [pesquisa, usuarios]);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const selecionarUsuario = (usuario) => {
    console.log("💬 Iniciando conversa com:", usuario.nome);

    if (!usuarioLogado) {
      Alert.alert("Erro", "Você precisa estar logado para enviar mensagens");
      return;
    }

    navigation.navigate("Chat", {
      destinatarioId: usuario.id,
      destinatarioNome: usuario.nome,
    });
  };

  const renderUsuario = ({ item }) => (
    <TouchableOpacity
      style={styles.usuarioItem}
      onPress={() => selecionarUsuario(item)}
    >
      <Image
        source={require("../../../assets/user1.jpg")}
        style={styles.avatar}
      />

      <View style={styles.usuarioInfo}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (!usuarioLogado) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="log-in-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>Usuário não logado</Text>
        <Text style={styles.errorSubtext}>
          Faça login para enviar mensagens
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Mensagem</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar usuários..."
          value={pesquisa}
          onChangeText={setPesquisa}
          autoFocus={true}
        />
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando usuários...</Text>
        </View>
      ) : (
        <FlatList
          data={usuariosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUsuario}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#CCC" />
              <Text style={styles.emptyTitle}>
                {pesquisa
                  ? "Nenhum usuário encontrado"
                  : "Nenhum usuário disponível"}
              </Text>
              <Text style={styles.emptyText}>
                {pesquisa
                  ? "Tente buscar com outros termos"
                  : "Todos os usuários estão listados aqui"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  usuarioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  usuarioInfo: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF3B30",
    marginTop: 10,
    marginBottom: 5,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
