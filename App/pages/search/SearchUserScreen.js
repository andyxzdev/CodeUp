import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { api } from "../../api/config";

export default function SearchUserScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const res = await api.get("/usuarios");

      if (res?.sucesso) {
        setAllUsers(res.dados);
        setFiltered(res.dados);
      }
    } catch (e) {
      console.log("Erro ao carregar usuários:", e);
    }
  };

  const filtrar = (texto) => {
    setSearch(texto);

    if (!texto.trim()) {
      setFiltered(allUsers);
      return;
    }

    const resultado = allUsers.filter((u) =>
      u.nome.toLowerCase().includes(texto.toLowerCase())
    );

    setFiltered(resultado);
  };

  const abrirPerfil = (id) => {
    navigation.navigate("Profile", { id: item.id });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Pesquisar usuário..."
        style={styles.input}
        value={search}
        onChangeText={filtrar}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.user}
            onPress={() => abrirPerfil(item.id)}
          >
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#444" }}>
            Nenhum usuário encontrado.
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  user: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { color: "#555" },
});
