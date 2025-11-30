// App/screens/CreatePostScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { publicacaoService } from "../../api/publicacaoService";
import { useAuth } from "../../hooks/useAuth";

export default function CreatePostScreen({ navigation }) {
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState(null); // { uri, name, type }
  const [carregando, setCarregando] = useState(false);

  const { usuario } = useAuth();

  //---------------------------------------------------------
  // PERMISSÕES
  //---------------------------------------------------------
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const libStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const camStatus = await ImagePicker.requestCameraPermissionsAsync();

        if (libStatus.status !== "granted" || camStatus.status !== "granted") {
          Alert.alert(
            "Permissões necessárias",
            "Autorize câmera e galeria para postar imagens."
          );
        }
      }
    })();
  }, []);

  //---------------------------------------------------------
  // ESCOLHER IMAGEM DA GALERIA
  //---------------------------------------------------------
  const escolherImagem = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      setImagem({
        uri: asset.uri,
        name: asset.fileName || asset.uri.split("/").pop(),
        type: asset.mimeType || "image/jpeg",
      });
    } catch (e) {
      console.log("❌ Erro ao escolher imagem:", e);
      Alert.alert("Erro", "Não foi possível carregar a imagem");
    }
  };

  //---------------------------------------------------------
  // TIRAR FOTO
  //---------------------------------------------------------
  const tirarFoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: false,
        cameraType: ImagePicker.CameraType.back,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      setImagem({
        uri: asset.uri,
        name: asset.fileName || asset.uri.split("/").pop(),
        type: asset.mimeType || "image/jpeg",
      });
    } catch (e) {
      console.log("❌ ERRO AO TIRAR FOTO:", JSON.stringify(e, null, 2));
      Alert.alert("Erro", "Não foi possível capturar a foto");
    }
  };

  //---------------------------------------------------------
  // CRIAR PUBLICAÇÃO
  //---------------------------------------------------------
  const criarPublicacao = async () => {
    if (!texto.trim() && !imagem) {
      return Alert.alert("Erro", "Digite algo ou envie uma imagem.");
    }

    setCarregando(true);

    try {
      const payload = {
        conteudo: texto,
        imagemUri: imagem ? imagem.uri : null,
        imagemName: imagem ? imagem.name : null,
        imagemType: imagem ? imagem.type : null,
      };

      const res = await publicacaoService.criarPublicacao(payload);

      console.log("📤 RESPOSTA BACKEND:", res);

      if (res?.sucesso) {
        Alert.alert("Sucesso", "Publicação criada!");
        setTexto("");
        setImagem(null);
        navigation.goBack();
      } else {
        Alert.alert("Erro", res?.mensagem || "Não foi possível publicar");
      }
    } catch (e) {
      console.log("❌ Erro ao criar publicação:", e);
      Alert.alert("Erro", "Falha ao criar publicação");
    } finally {
      setCarregando(false);
    }
  };

  //---------------------------------------------------------
  // UI
  //---------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Publicação</Text>

      <TextInput
        placeholder="No que você está pensando?"
        style={styles.input}
        multiline
        value={texto}
        onChangeText={setTexto}
      />

      {/* Preview da imagem */}
      {imagem?.uri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imagem.uri }} style={styles.preview} />
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => setImagem(null)}
          >
            <Ionicons name="close-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.row}>
        <TouchableOpacity style={styles.iconBtn} onPress={escolherImagem}>
          <Ionicons name="image-outline" size={24} color="#007AFF" />
          <Text style={styles.iconLabel}>Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={tirarFoto}>
          <Ionicons name="camera-outline" size={24} color="#007AFF" />
          <Text style={styles.iconLabel}>Câmera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={criarPublicacao}
        disabled={carregando}
        style={[styles.botao, carregando && { backgroundColor: "#999" }]}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTxt}>Publicar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

//------------------------------------------------------------
// ESTILOS
//------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 150,
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  iconBtn: {
    alignItems: "center",
  },
  iconLabel: {
    marginTop: 6,
    color: "#007AFF",
  },
  botao: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  previewContainer: {
    height: 220,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 2,
  },
});
