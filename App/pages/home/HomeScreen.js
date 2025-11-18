// App/pages/Home/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";

export default function HomeScreen({ navigation }) {
  const { usuario, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer logout");
    }
  };

  // Dados fake (substituir depois por backend)
  const stories = [
    { id: "2", name: "user1", image: require("../../../assets/user1.jpg") },
    { id: "3", name: "user2", image: require("../../../assets/user1.jpg") },
    { id: "4", name: "user3", image: require("../../../assets/user1.jpg") },
  ];

  const posts = [
    {
      id: "1",
      user: "user.123",
      avatar: require("../../../assets/user1.jpg"),
      description: "lorem ipsum12345678910",
      image: require("../../../assets/user1.jpg"),
      likes: 99,
      comments: 99,
      favorites: 99,
    },
    {
      id: "2",
      user: "user.456",
      avatar: require("../../../assets/user1.jpg"),
      description: "Meu setup gamer 🔥",
      image: require("../../../assets/user1.jpg"),
      likes: 45,
      comments: 12,
      favorites: 8,
    },
  ];

  // Renderiza cada post
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Header do Post */}
      <View style={styles.postHeader}>
        <Image source={item.avatar} style={styles.avatar} />
        <View>
          <Text style={styles.username}>@{item.user}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color="#000"
          style={{ marginLeft: "auto" }}
        />
      </View>

      {/* Imagem do Post */}
      <Image source={item.image} style={styles.postImage} />

      {/* Ações */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart" size={22} color="red" />
          <Text>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={22} color="#000" />
          <Text>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="star" size={22} color="#000" />
          <Text>{item.favorites}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={25} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Saudação do usuário */}
      <View style={styles.userWelcome}>
        <Text style={styles.welcomeText}>Olá, {usuario?.nome}!</Text>
        <Text style={styles.welcomeSubtext}>Bem-vindo de volta 👋</Text>
      </View>

      {/* Stories */}
      <FlatList
        data={stories}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.story}>
            <Image source={item.image} style={styles.storyImage} />
            <Text style={styles.storyName}>{item.name}</Text>
          </View>
        )}
      />

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        style={styles.feed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 50, // Para status bar
  },
  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
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
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#555",
  },
  postImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
});
