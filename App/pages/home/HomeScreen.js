// App/screens/HomeScreen.js
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
import ModalComentarios from "../../../components/ModalComentarios";

// 🟦 Função para converter createdAt recebido como array
const parseCreatedAt = (arr) => {
  if (!arr || !Array.isArray(arr)) return null;
  return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
};

export default function HomeScreen({ navigation }) {
  const { usuario } = useAuth();
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [postSelecionado, setPostSelecionado] = useState(null);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  const carregarFeed = async () => {
    try {
      setCarregando(true);

      const response = await publicacaoService.getFeed(0, 20);

      if (response.sucesso && response.dados?.content) {
        const publicacoesValidas = response.dados.content.filter(
          (pub) => pub?.id && (pub?.conteudo || pub?.imageUrl)
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

  useEffect(() => {
    carregarFeed();
  }, []);

  const handleCurtir = async (id) => {
    try {
      const response = await publicacaoService.curtir(id);

      if (response.sucesso) {
        setPublicacoes((prev) =>
          prev.map((pub) =>
            pub.id === id
              ? { ...pub, curtidasCount: pub.curtidasCount + 1 }
              : pub
          )
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao curtir publicação");
    }
  };

  const handleSalvar = async (id) => {
    try {
      const response = await publicacaoService.salvar(id);

      if (response.sucesso) {
        Alert.alert("Sucesso", "Publicação salva!");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar publicação");
    }
  };

  const abrirComentarios = (item) => {
    setPostSelecionado(item);
    setMostrarComentarios(true);
  };

  const renderPublicacao = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.authorName?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.username}>@{item.authorName}</Text>
          <Text style={styles.time}>
            {parseCreatedAt(item.createdAt)?.toLocaleDateString("pt-BR") ||
              "--"}
          </Text>
        </View>
      </View>

      <Text style={styles.postText}>{item.conteudo}</Text>

      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleCurtir(item.id)}
          style={styles.actionBtn}
        >
          <Ionicons name="heart-outline" size={22} color="#ff4060" />
          <Text style={styles.actionLabel}>{item.curtidasCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => abrirComentarios(item)}
        >
          <Ionicons name="chatbubble-outline" size={22} color="#555" />
          <Text style={styles.actionLabel}>{item.comentariosCount || 0}</Text>
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
      {mostrarComentarios && postSelecionado && (
        <ModalComentarios
          publicacaoId={postSelecionado.id}
          onClose={() => setMostrarComentarios(false)}
        />
      )}

      <View style={styles.header}>
        <Image
          source={require("../../../assets/logo/CODE-UP2.png")}
          style={styles.logo}
        />

        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Ionicons name="notifications" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  feed: { paddingHorizontal: 15, marginTop: 10 },
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
  postText: { fontSize: 15, color: "#333", marginBottom: 12 },
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 18 },
  actionLabel: { marginLeft: 6, fontSize: 14, color: "#555" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
