// pages/Messages/NovaMensagemScreen.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { usuarioService } from "../../api/usuarioService";

// simple debounce
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function NovaMensagemScreen({ navigation }) {
  const { usuario: usuarioLogado } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuarios = useCallback(async () => {
    try {
      setCarregando(true);
      const lista = await usuarioService.buscarUsuarios();
      // remove usuário logado
      const filtrada = lista.filter((u) => u.id !== usuarioLogado?.id);
      setUsuarios(filtrada);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setUsuarios([]);
    } finally {
      setCarregando(false);
    }
  }, [usuarioLogado?.id]);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  // filtra localmente (mais rápido) mas também permite busca por API:
  const usuariosFiltrados = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) => {
      const nome = (u.nome || "").toString().toLowerCase();
      const email = (u.email || "").toString().toLowerCase();
      return nome.includes(q) || email.includes(q);
    });
  }, [debouncedQuery, usuarios]);

  const selecionarUsuario = (usuario) => {
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
          placeholder="Pesquisar usuários..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={usuariosFiltrados}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          renderItem={renderUsuario}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#CCC" />
              <Text style={styles.emptyTitle}>
                {query
                  ? "Nenhum usuário encontrado"
                  : "Nenhum usuário disponível"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    height: 44,
  },
  searchInput: { marginLeft: 8, flex: 1 },
  usuarioItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  usuarioInfo: { flex: 1 },
  nome: { fontWeight: "600" },
  email: { color: "#666", marginTop: 2 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyTitle: { marginTop: 12, color: "#777" },
});
