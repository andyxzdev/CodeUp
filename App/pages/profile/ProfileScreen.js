import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const userData = {
    username: "caio.developer",
    name: "Caio Developer",
    bio: "Desenvolvedor Mobile | React Native | Expo 🚀",
    followers: "1,2M",
    following: "345",
    avatar: require("../../../assets/user1.jpg"),
  };

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

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Image source={item.image} style={styles.postImage} />
      <Text style={styles.postDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Image source={userData.avatar} style={styles.profileAvatar} />
        <Text style={styles.usernameText}>@{userData.username}</Text>
        <Text style={styles.nameText}>{userData.name}</Text>
        <Text style={styles.bioText}>{userData.bio}</Text>

        {}
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>
            <Text style={styles.statCount}>{userData.following}</Text> Seguindo
          </Text>
          <Text style={styles.statText}>
            <Text style={styles.statCount}>{userData.followers}</Text>{" "}
            Seguidores
          </Text>
        </View>

        {}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.separator} />

      {}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        numColumns={2}
        columnWrapperStyle={styles.postRow}
        showsVerticalScrollIndicator={false}
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
    padding: 20,
    alignItems: "center",
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#0068F5",
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  nameText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  bioText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    marginBottom: 20,
  },
  statText: {
    fontSize: 14,
    color: "#555",
  },
  statCount: {
    fontWeight: "bold",
    color: "#000",
  },
  editButton: {
    backgroundColor: "#EFEFEF",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  editButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#EEE",
    marginHorizontal: 10,
    marginBottom: 10,
  },

  postRow: {
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  postContainer: {
    width: "49%",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 5,
  },
  postDescription: {
    fontSize: 12,
    paddingVertical: 5,
    textAlign: "center",
  },
});
