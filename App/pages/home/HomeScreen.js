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

  const carregarFeed = async () => {
    try {
      setCarregando(true);

      const response = await publicacaoService.getFeed(0, 20);

      if (response.sucesso && response.dados?.content) {
        const publicacoesValidas = response.dados.content.filter(
          (pub) => pub?.id && pub?.conteudo
        );

        setPublicacoes(publicacoesValidas);
      } else {
        setPublicacoes([]);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar feed");
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const handleCurtir = async (publicacaoId) => {
    try {
      const response = await publicacaoService.curtirPublicacao(publicacaoId);

      if (response.sucesso) {
        setPublicacoes((prev) =>
          prev.map((pub) =>
            pub.id === publicacaoId
              ? { ...pub, curtidasCount: pub.curtidasCount + 1 }
              : pub
          )
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao curtir publicação");
    }
  };

  const handleSalvar = async (publicacaoId) => {
    try {
      const response = await publicacaoService.salvarPublicacao(publicacaoId);

      if (response.sucesso) {
        Alert.alert("Sucesso", "Publicação salva!");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar publicação");
    }
  };

  useEffect(() => {
    carregarFeed();
  }, []);

  const renderPublicacao = ({ item }) => (
    <View style={styles.postContainer}>
      {/* HEADER */}
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.authorName?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.username}>@{item.authorName}</Text>
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>

      {/* CONTEÚDO */}
      <Text style={styles.postText}>{item.conteudo}</Text>

      {/* AÇÕES */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleCurtir(item.id)}
          style={styles.actionBtn}
        >
          <Ionicons name="heart-outline" size={22} color="#ff4060" />
          <Text style={styles.actionLabel}>{item.curtidasCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={22} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSalvar(item.id)}
          style={styles.actionBtn}
        >
          <Ionicons name="bookmark-outline" size={22} color="#555" />
          <Text style={styles.actionLabel}>{item.salvosCount || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/logo/CODE-UP2.png")}
          style={styles.logo}
        />

        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Ionicons name="notifications" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* FEED */}
      <FlatList
        data={publicacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPublicacao}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          carregarFeed();
        }}
        style={styles.feed}
      />

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={26} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={26} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("CreatePost")}>
          <Ionicons name="add-circle" size={30} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
          <Ionicons name="chatbubble" size={26} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("MyProfile")}>
          <Ionicons name="person" size={26} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ======================= ESTILOS ======================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /* HEADER */
  header: {
    backgroundColor: "#ffffffff",
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { width: 65, height: 65 },

  /* FEED */
  feed: { paddingHorizontal: 15, marginTop: 10 },

  /* POST */
  postContainer: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  userInfo: { marginLeft: 12 },
  username: { fontSize: 16, fontWeight: "bold", color: "#333" },
  time: { fontSize: 12, color: "#777" },

  postText: { fontSize: 15, color: "#333", marginBottom: 15 },

  /* AÇÕES */
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
  },
  actionBtn: { flexDirection: "row", alignItems: "center" },
  actionLabel: { marginLeft: 5, fontSize: 14, color: "#555" },

  /* LOADING */
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* FOOTER */
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
