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

  // ============================================================
  // 🚀 Função que carrega conversas
  // ============================================================
  const carregarConversas = useCallback(async () => {
    if (!usuarioLogado?.id) {
      console.log("⛔ Usuário não está pronto ainda");
      return;
    }

    try {
      setCarregando(true);

      console.log(`📥 Carregando conversas de ${usuarioLogado.id}...`);
      const resposta = await mensagemService.getConversasRecentes(
        usuarioLogado.id
      );

      console.log("📦 Conversas retornadas:", resposta);

      if (resposta.sucesso) {
        setConversas(resposta.dados);
      } else {
        setConversas([]);
      }
    } catch (error) {
      console.log("❌ Erro ao carregar conversas:", error);
      setConversas([]);
    } finally {
      setCarregando(false);
    }
  }, [usuarioLogado]);

  // ============================================================
  // 1️⃣ Carrega só quando o useAuth terminar
  // ============================================================
  useEffect(() => {
    if (!carregandoAuth && usuarioLogado?.id) {
      carregarConversas();
    }
  }, [carregandoAuth, usuarioLogado]);

  // ============================================================
  // 2️⃣ Recarregar quando voltar para a tela
  // ============================================================
  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      if (!carregandoAuth && usuarioLogado?.id) {
        carregarConversas();
      }
    });

    return unsub;
  }, [navigation, carregandoAuth, usuarioLogado]);

  // ============================================================
  // Render
  // ============================================================

  if (carregandoAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Verificando usuário...</Text>
      </View>
    );
  }

  if (!usuarioLogado) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Faça login para ver conversas</Text>
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

  const conversasFiltradas = conversas.filter((c) =>
    c.usuarioNome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <TouchableOpacity onPress={() => navigation.navigate("NovaMensagem")}>
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          value={pesquisa}
          onChangeText={setPesquisa}
        />
      </View>

      <FlatList
        data={conversasFiltradas}
        keyExtractor={(item) => item.usuarioId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversaItem}
            onPress={() =>
              navigation.navigate("Chat", {
                destinatarioId: item.usuarioId,
                destinatarioNome: item.usuarioNome,
              })
            }
          >
            <Image
              source={require("../../../assets/user1.jpg")}
              style={styles.avatar}
            />

            <View style={styles.conversaInfo}>
              <Text style={styles.nome}>{item.usuarioNome}</Text>
              <Text style={styles.ultimaMensagem}>{item.ultimaMensagem}</Text>
            </View>

            <Text style={styles.hora}>
              {new Date(item.enviadoEm).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    margin: 15,
    padding: 10,
    borderRadius: 10,
  },
  searchInput: { marginLeft: 10, flex: 1 },
  conversaItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  conversaInfo: { flex: 1 },
  nome: { fontWeight: "600" },
  ultimaMensagem: { color: "#777" },
  hora: { color: "#777", fontSize: 12 },
});
