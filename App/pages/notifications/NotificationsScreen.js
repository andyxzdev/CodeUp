// App/pages/Notifications/NotificationsScreen.js
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import { notificacaoService } from "../../api/notificacaoService";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 🔥 Carregar notificações do backend
  const carregarNotificacoes = useCallback(async () => {
    try {
      setCarregando(true);
      console.log("📡 Carregando notificações...");

      const lista = await notificacaoService.listar();

      console.log("📥 Notificações recebidas:", lista);

      setNotifications(lista);
    } catch (err) {
      console.log("❌ Erro ao carregar notificações:", err);
      setNotifications([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  // 🔵 Marcar como lida
  const marcarComoLida = async (id) => {
    try {
      await notificacaoService.marcarComoLida(id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
    } catch (e) {
      console.log("❌ Erro ao marcar como lida:", e);
    }
  };

  const NotificationsItem = ({ item }) => {
    const safeDate = item.createdAt?.replace(/-/g, "/");

    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          !item.lida && styles.itemUnreadBackground,
        ]}
        onPress={() => marcarComoLida(item.id)}
      >
        <View style={styles.notificationsContent}>
          {!item.lida && (
            <Ionicons
              name="ellipse"
              size={10}
              color="blue"
              style={styles.unreadIndicator}
            />
          )}

          <View style={styles.textContainer}>
            <Text style={{ fontWeight: item.lida ? "normal" : "bold" }}>
              {item.mensagem}
            </Text>

            <Text style={styles.messageText}>
              {item.tipo === "curtida" && "👍 Curtida na sua publicação"}
              {item.tipo === "comentario" && "💬 Novo comentário"}
              {item.tipo === "seguindo" && "👤 Novo seguidor"}
              {item.tipo === "mensagem" && "📩 Nova mensagem received"}
              {item.tipo === "salvo" && "⭐ Salvou sua publicação"}
            </Text>
          </View>

          <Text style={styles.dateText}>
            {safeDate
              ? new Date(safeDate).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.HeaderTitle}>Notificações</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NotificationsItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 100, alignItems: "center" }}>
            <Ionicons name="notifications-off-outline" size={64} color="#AAA" />
            <Text style={{ marginTop: 10, color: "#777" }}>
              Nenhuma notificação no momento
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  HeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  itemUnreadBackground: {
    backgroundColor: "#E6F0FF",
    borderLeftWidth: 5,
    borderLeftColor: "#1E90FF",
  },
  notificationsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  unreadIndicator: {
    marginRight: 10,
    alignSelf: "flex-start",
    marginTop: 3,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  messageText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  dateText: {
    fontSize: 10,
    color: "#aaa",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
