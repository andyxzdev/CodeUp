import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { mensagemService } from "../../api/mensagemService";

export default function ConversasScreen({ navigation }) {
  const { usuario: usuarioLogado, carregando: carregandoAuth } = useAuth();
  const [conversas, setConversas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    console.log("=== 🔍 CONVERSAS SCREEN DEBUG ===");
    console.log("usuarioLogado:", usuarioLogado);
    console.log("carregandoAuth:", carregandoAuth);
    console.log("================================");
  }, [usuarioLogado, carregandoAuth]);

  const carregarConversas = useCallback(async () => {
    if (!usuarioLogado || !usuarioLogado.id) {
      console.log("❌ Não é possível carregar conversas: usuário não logado");
      setCarregando(false);
      setConversas([]);
      return;
    }

    try {
      setCarregando(true);
      console.log(
        `📋 Carregando conversas para usuário ${usuarioLogado.id}...`
      );

      const response = await mensagemService.getConversasRecentes(
        usuarioLogado.id
      );
      console.log("📦 Resposta das conversas:", response);

      if (response.sucesso && response.dados) {
        setConversas(response.dados);
      } else {
        console.log("⚠️ Nenhuma conversa encontrada");
        setConversas([]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar conversas:", error);
      Alert.alert("Erro", "Não foi possível carregar as conversas");
      setConversas([]);
    } finally {
      setCarregando(false);
    }
  }, [usuarioLogado]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("🎯 ConversasScreen ganhou foco");
      if (usuarioLogado?.id) {
        carregarConversas();
      }
    });

    return unsubscribe;
  }, [navigation, carregandoAuth, usuarioLogado]);

  useEffect(() => {
    if (!carregandoAuth && usuarioLogado?.id) {
      console.log("🚀 Carregando conversas inicialmente...");
      carregarConversas();
    } else if (!carregandoAuth) {
      console.log("⏹️  Usuário não logado, não carregando conversas");
      setCarregando(false);
    }
  }, [carregandoAuth, usuarioLogado]);

  const novaMensagem = () => {
    console.log("➕ Abrindo tela de nova mensagem");

    if (!usuarioLogado) {
      Alert.alert("Erro", "Você precisa estar logado para enviar mensagens");
      return;
    }

    navigation.navigate("NovaMensagem");
  };

  const formatarHora = (dataString) => {
    if (!dataString) return "";

    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutos < 1) return "Agora";
    if (diffMinutos < 60) return `${diffMinutos}m`;
    if (diffHoras < 24) return `${diffHoras}h`;
    if (diffDias < 7) return `${diffDias}d`;

    return data.toLocaleDateString("pt-BR");
  };

  const renderConversa = ({ item }) => (
    <TouchableOpacity
      style={styles.conversaItem}
      onPress={() => {
        if (!usuarioLogado) {
          Alert.alert("Erro", "Você precisa estar logado para acessar o chat");
          return;
        }
        navigation.navigate("Chat", {
          destinatarioId: item.id,
          destinatarioNome: item.nome,
        });
      }}
    >
      <Image
        source={require("../../../assets/user1.jpg")}
        style={styles.avatar}
      />

      <View style={styles.conversaInfo}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.ultimaMensagem} numberOfLines={1}>
          {item.ultimaMensagem || "Nenhuma mensagem"}
        </Text>
      </View>

      <View style={styles.conversaMeta}>
        <Text style={styles.hora}>{formatarHora(item.enviadoEm)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (carregandoAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Verificando autenticação...</Text>
      </View>
    );
  }

  if (!usuarioLogado) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="log-in-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>Usuário não logado</Text>
        <Text style={styles.errorSubtext}>
          Faça login para acessar as mensagens
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

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando conversas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <TouchableOpacity onPress={novaMensagem} style={styles.novoChatButton}>
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar conversas..."
          value={pesquisa}
          onChangeText={setPesquisa}
        />
      </View>

      <FlatList
        data={conversas.filter((conversa) =>
          conversa.nome.toLowerCase().includes(pesquisa.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderConversa}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={64}
              color="#CCC"
            />
            <Text style={styles.emptyTitle}>Nenhuma conversa</Text>
            <Text style={styles.emptyText}>
              Suas conversas aparecerão aqui quando você começar a trocar
              mensagens.
            </Text>
            <TouchableOpacity
              style={styles.novaConversaButton}
              onPress={novaMensagem}
            >
              <Text style={styles.novaConversaText}>Iniciar Nova Conversa</Text>
            </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  novoChatButton: {
    padding: 5,
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
  conversaItem: {
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
  conversaInfo: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  ultimaMensagem: {
    fontSize: 14,
    color: "#666",
  },
  conversaMeta: {
    alignItems: "flex-end",
  },
  hora: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
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
    marginBottom: 20,
  },
  novaConversaButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  novaConversaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
