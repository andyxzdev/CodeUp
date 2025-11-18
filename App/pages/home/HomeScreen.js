import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { publicacaoService } from "../../api/publicacaoService";

export default function HomeScreen({ navigation }) {
  const { usuario, logout } = useAuth();
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer logout");
    }
  };

  // Buscar feed real do backend
  const carregarFeed = async () => {
    try {
      setCarregando(true);
      console.log("🔄 Carregando feed real...");

      const response = await publicacaoService.getFeed(0, 20);
      console.log("📦 Resposta completa do feed:", response);

      if (response.sucesso && response.dados && response.dados.content) {
        // 🔥 FILTRAR publicações com dados válidos
        const publicacoesValidas = response.dados.content.filter(
          (pub) => pub.conteudo !== null && pub.id !== null
        );

        console.log(
          `✅ ${publicacoesValidas.length} publicações válidas carregadas`
        );
        setPublicacoes(publicacoesValidas);
      } else {
        console.warn("⚠️ Nenhuma publicação válida encontrada");
        setPublicacoes([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar feed:", error);
      Alert.alert("Erro", "Falha ao carregar feed");
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  // Curtir publicação
  const handleCurtir = async (publicacaoId) => {
    try {
      console.log(`❤️ Curtindo publicação ${publicacaoId}`);

      const response = await publicacaoService.curtirPublicacao(publicacaoId);

      if (response.sucesso) {
        // Atualizar lista localmente
        setPublicacoes((prevPublicacoes) =>
          prevPublicacoes.map((pub) =>
            pub.id === publicacaoId
              ? { ...pub, curtidasCount: pub.curtidasCount + 1 }
              : pub
          )
        );
      }
    } catch (error) {
      console.error("❌ Erro ao curtir:", error);
      Alert.alert("Erro", "Falha ao curtir publicação");
    }
  };

  // Salvar publicação
  const handleSalvar = async (publicacaoId) => {
    try {
      console.log(`⭐ Salvando publicação ${publicacaoId}`);

      const response = await publicacaoService.salvarPublicacao(publicacaoId);

      if (response.sucesso) {
        Alert.alert("Sucesso", "Publicação salva!");
      }
    } catch (error) {
      console.error("❌ Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao salvar publicação");
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    carregarFeed();
  };

  useEffect(() => {
    carregarFeed();
  }, []);

  // Render modificado para lidar com dados null
  const renderPublicacao = ({ item }) => {
    if (!item.conteudo || !item.id) {
      return null; // Não renderizar publicações inválidas
    }

    return (
      <View style={styles.postContainer}>
        {/* Header do Post */}
        <View style={styles.postHeader}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.authorName?.charAt(0) || "U"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>@{item.authorName || "usuário"}</Text>
            <Text style={styles.timestamp}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("pt-BR")
                : "Data desconhecida"}
            </Text>
          </View>
        </View>

        {/* Conteúdo do Post */}
        <Text style={styles.conteudo}>{item.conteudo}</Text>

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleCurtir(item.id)}
          >
            <Ionicons name="heart-outline" size={22} color="#000" />
            <Text style={styles.actionText}>{item.curtidasCount || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={22} color="#000" />
            <Text style={styles.actionText}>{item.comentariosCount || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleSalvar(item.id)}
          >
            <Ionicons name="bookmark-outline" size={22} color="#000" />
            <Text style={styles.actionText}>{item.salvosCount || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando publicações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Personalizado */}
      <View style={styles.topo}>
        <Image
          style={styles.logoTopo}
          source={require("../../../assets/logo/CODE-UP2.png")}
        />

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            style={styles.botaoTopo}
          >
            <Ionicons name="notifications" size={35} color="#0068F5" />
          </TouchableOpacity>

          {/*<TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={25} color="#FF3B30" />
          </TouchableOpacity>*/}
        </View>
      </View>

      {/* Feed REAL */}
      <FlatList
        data={publicacoes}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderPublicacao}
        showsVerticalScrollIndicator={false}
        style={styles.feed}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma publicação encontrada</Text>
            <Text style={styles.emptySubtext}>
              Seja o primeiro a compartilhar algo!
            </Text>
          </View>
        }
      />

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search" size={24} color="#666" />
          <Text style={styles.footerText}>Pesquisa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Ionicons name="add-circle" size={24} color="#666" />
          <Text style={styles.footerText}>Criar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Messages")}
        >
          <Ionicons name="chatbubble" size={24} color="#666" />
          <Text style={styles.footerText}>Mensagens</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person" size={24} color="#666" />
          <Text style={styles.footerText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 50,
  },
  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 90,
    marginTop: -20,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoTopo: {
    width: 70,
    height: 70,
  },
  botaoTopo: {
    marginRight: 15,
  },
  logoutBtn: {
    padding: 5,
  },
  userWelcome: {
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  /** Stories */
  storiesList: {
    paddingVertical: 10,
    paddingLeft: 0,
    marginTop: 10,
  },
  story: {
    alignItems: "center",
    marginRight: 15,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#3b33ff",
  },
  storyName: {
    fontSize: 12,
    marginTop: 4,
  },
  /** Posts */
  postContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -210,
    backgroundColor: "#999",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  conteudo: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  /** Loading */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  /** Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  /** 🔥 FOOTER STYLES */
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  footerText: {
    fontSize: 10,
    marginTop: 2,
    color: "#666",
  },
});
