import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

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
      <View style={styles.topo}>
        <Image
          style={styles.logoTopo}
          source={require("../../../assets/logo/CODE-UP2.png")}
        />

        <TouchableOpacity
          onPress={() => router.push("/app")}
          style={styles.botaoTopo}
        >
          <Ionicons
            name="notifications"
            size={35}
            color="#0068F5"
            marginTop={65}
          ></Ionicons>
        </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },

  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
  },

  logoTopo: {
    width: 70,
    height: 70,
    marginTop: 50,
  },

  /** Stories */
  storiesList: { paddingVertical: 10, paddingLeft: 0, marginTop: "10%" },
  story: { alignItems: "center", marginRight: 15 },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#3b33ff",
  },
  storyName: { fontSize: 12, marginTop: 4 },

  /** Posts */
  postContainer: { marginBottom: 20, backgroundColor: "#fff", marginTop: 20 },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: "bold" },
  description: { fontSize: 12, color: "#555" },
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
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
});
