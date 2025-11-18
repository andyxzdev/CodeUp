import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService } from "../../api/usuarioService";

export default function ProfileScreen({ navigation, route }) {
  const { usuario: usuarioLogado } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("publicacoes");

  // ✅ CORREÇÃO: Debug do ID
  const usuarioId = route.params?.usuarioId || usuarioLogado?.id;

  // 🔥 DEBUG: Verificar os valores
  useEffect(() => {
    console.log("=== 🔍 DEBUG PROFILE SCREEN ===");
    console.log("route.params:", route.params);
    console.log("usuarioLogado:", usuarioLogado);
    console.log("usuarioLogado?.id:", usuarioLogado?.id);
    console.log("usuarioLogado?.id tipo:", typeof usuarioLogado?.id);
    console.log("usuarioId final:", usuarioId);
    console.log("usuarioId tipo:", typeof usuarioId);
    console.log("============================");
  }, []);

  // ✅ CORREÇÃO: useCallback melhorado
  const carregarPerfil = useCallback(async () => {
    try {
      setCarregando(true);
      console.log(`🎯 carregarPerfil chamado para usuarioId: ${usuarioId}`);

      // ✅ CORREÇÃO: Verificar se temos um ID válido
      if (!usuarioId || usuarioId === "undefined" || usuarioId === "null") {
        console.log("⚠️  ID inválido, usando dados locais");
        setUsuario(usuarioLogado);
        setCarregando(false);
        return;
      }

      const response = await usuarioService.getPerfil(usuarioId);
      console.log("📦 Resposta do service:", response);

      // ✅ CORREÇÃO: Agora response já é o data (não precisa de response.data)
      if (response.sucesso && response.dados) {
        console.log("✅ Perfil carregado com sucesso:", response.dados);
        setUsuario(response.dados);
      } else {
        console.log("❌ Resposta sem sucesso do backend");
        // Se não conseguir carregar, usa dados do usuário logado
        setUsuario(
          usuarioLogado || {
            nome: "Usuário",
            email: "",
            bio: "Sem bio ainda...",
            fotoPerfil: null,
          }
        );
      }
    } catch (error) {
      console.error("❌ Erro ao carregar perfil:", error);
      // Em caso de erro, usa dados do usuário logado
      setUsuario(
        usuarioLogado || {
          nome: "Usuário",
          email: "",
          bio: "Sem bio ainda...",
          fotoPerfil: null,
        }
      );
    } finally {
      setCarregando(false);
    }
  }, [usuarioId, usuarioLogado]);

  // ✅ CORREÇÃO: useEffect melhorado
  useEffect(() => {
    console.log("🎯 useEffect executado - usuarioId:", usuarioId);

    if (usuarioId && usuarioId !== "undefined" && usuarioId !== "null") {
      carregarPerfil();
    } else {
      console.log("⚠️  Sem ID válido, usando dados locais");
      setUsuario(
        usuarioLogado || {
          nome: "Usuário",
          email: "",
          bio: "Sem bio ainda...",
          fotoPerfil: null,
        }
      );
      setCarregando(false);
    }
  }, [usuarioId, carregarPerfil, usuarioLogado]);

  // ✅ CORREÇÃO: Função para tentar novamente
  const tentarNovamente = () => {
    console.log("🔄 Tentando carregar perfil novamente...");
    carregarPerfil();
  };

  // Render simplificado enquanto debugamos
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Image
        source={require("../../../assets/user1.jpg")}
        style={styles.postImage}
      />
      <Text style={styles.postDescription}>
        {item.conteudo?.substring(0, 50) || "Publicação..."}
      </Text>
    </View>
  );

  // Loading state
  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  // Error state - se não tem usuário mesmo após carregar
  if (!usuario) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>Perfil não encontrado</Text>
        <Text style={styles.errorSubtext}>
          Não foi possível carregar os dados do perfil
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={tentarNovamente}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <Image
          source={
            usuario.fotoPerfil
              ? { uri: usuario.fotoPerfil }
              : require("../../../assets/user1.jpg")
          }
          style={styles.profileAvatar}
        />

        {/* Informações do usuário */}
        <Text style={styles.usernameText}>@{usuario.nome || "usuário"}</Text>
        <Text style={styles.nameText}>{usuario.nome || "Usuário"}</Text>
        <Text style={styles.bioText}>{usuario.bio || "Sem bio ainda..."}</Text>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statCount}>{publicacoes.length}</Text>
            <Text style={styles.statLabel}>Publicações</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statCount}>0</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statCount}>0</Text>
            <Text style={styles.statLabel}>Seguindo</Text>
          </View>
        </View>

        {/* Botão Editar Perfil */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", { usuario })}
        >
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Publicações */}
      <FlatList
        data={publicacoes}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderPost}
        numColumns={2}
        columnWrapperStyle={styles.postRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>Nenhuma publicação ainda</Text>
            <Text style={styles.emptySubtext}>
              Quando você fizer publicações, elas aparecerão aqui
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#0068F5",
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  nameText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  bioText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 20,
  },
  stat: {
    alignItems: "center",
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#EFEFEF",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  editButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
  retryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  postRow: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  postContainer: {
    width: "48%",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
  },
  postDescription: {
    fontSize: 12,
    paddingVertical: 5,
    textAlign: "center",
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
