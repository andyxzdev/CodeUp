// App/pages/Notifications/NotificationsScreen.js - CORRIGIDO
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const notificaçõesItens = [
  {
    id: "1",
    title: "Boas-Vindas ao CodeUp!😘",
    message: "Obrigado por se juntar a nós! Explore nosso App e se divirta.",
    isRead: false,
    date: "2025-10-13T10:00:00Z",
  },
  {
    id: "2",
    title: "Atualização de Perfil",
    message: "Seu Perfil foi atualizado com sucesso.",
    isRead: true,
    date: "2025-10-13T12:00:00Z",
  },
];

const NotificationsItem = ({ item, onMarkAsRead }) => {
  const safeDateString = item.date.replace(/-/g, "/");

  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        !item.isRead && styles.itemUnreadBackground,
      ]}
      onPress={() => onMarkAsRead(item.id)}
    >
      <View style={styles.notificationsContent}>
        {!item.isRead && (
          <Ionicons
            name="ellipse"
            size={10}
            color="blue"
            style={styles.unreadIndicator}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={{ fontWeight: item.isRead ? "normal" : "bold" }}>
            {item.title}
          </Text>
          <Text style={styles.messageText} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(safeDateString).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const renderNotificationsItem = ({ item }) => (
  <NotificationsItem item={item} onMarkAsRead={() => {}} />
);

// 🔥 CORREÇÃO AQUI: Mude para NotificationsScreen (com N maiúsculo)
export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(notificaçõesItens);

  return (
    <View style={styles.container}>
      <Text style={styles.HeaderTitle}>Notificação</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationsItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    // 🔥 CORREÇÃO: estava notificationContent
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    alignSelf: "flex-start",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 15,
  },
});
