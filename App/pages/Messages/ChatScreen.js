import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { mensagemService } from "../../api/mensagemService";

export default function ChatScreen({ navigation, route }) {
  const { usuario: usuarioLogado } = useAuth();
  const { destinatarioId, destinatarioNome } = route.params;

  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const flatListRef = useRef();

  // Carregar conversa
  const carregarConversa = useCallback(async () => {
    try {
      setCarregando(true);
      console.log(`💬 Carregando conversa com ${destinatarioId}`);

      const conversa = await mensagemService.getConversa(
        usuarioLogado.id,
        destinatarioId
      );

      console.log("📦 Mensagens carregadas:", conversa);
      setMensagens(conversa || []);
    } catch (error) {
      console.error("❌ Erro ao carregar conversa:", error);
      Alert.alert("Erro", "Não foi possível carregar a conversa");
      setMensagens([]);
    } finally {
      setCarregando(false);
    }
  }, [usuarioLogado.id, destinatarioId]);

  // Enviar mensagem
  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return;

    try {
      setEnviando(true);

      const mensagemData = {
        remetenteId: usuarioLogado.id,
        destinatarioId: destinatarioId,
        conteudo: novaMensagem.trim(),
      };

      console.log("📤 Enviando mensagem:", mensagemData);
      await mensagemService.enviar(mensagemData);

      // Limpar input e recarregar conversa
      setNovaMensagem("");
      carregarConversa();
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error);
      Alert.alert("Erro", "Não foi possível enviar a mensagem");
    } finally {
      setEnviando(false);
    }
  };

  // Carregar conversa quando a tela abrir
  useEffect(() => {
    if (usuarioLogado?.id && destinatarioId) {
      carregarConversa();
    }
  }, [usuarioLogado?.id, destinatarioId, carregarConversa]);

  // Configurar header
  useEffect(() => {
    navigation.setOptions({
      title: destinatarioNome || "Chat",
      headerBackTitle: "Conversas",
    });
  }, [navigation, destinatarioNome]);

  // Formatar hora da mensagem
  const formatarHora = (dataString) => {
    if (!dataString) return "";

    const data = new Date(dataString);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Renderizar mensagem
  const renderMensagem = ({ item }) => {
    const isEu = item.remetenteId === usuarioLogado.id;

    return (
      <View
        style={[
          styles.mensagemContainer,
          isEu ? styles.mensagemEu : styles.mensagemOutro,
        ]}
      >
        <View
          style={[
            styles.mensagemBubble,
            isEu ? styles.bubbleEu : styles.bubbleOutro,
          ]}
        >
          <Text
            style={[
              styles.mensagemTexto,
              isEu ? styles.textoEu : styles.textoOutro,
            ]}
          >
            {item.conteudo}
          </Text>
          <Text
            style={[
              styles.mensagemHora,
              isEu ? styles.horaEu : styles.horaOutro,
            ]}
          >
            {formatarHora(item.enviadoEm)}
          </Text>
        </View>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando conversa...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Lista de Mensagens */}
      <FlatList
        ref={flatListRef}
        data={mensagens}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderMensagem}
        style={styles.mensagensList}
        contentContainerStyle={styles.mensagensContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>
              Inicie uma conversa com {destinatarioNome}
            </Text>
          </View>
        }
      />

      {/* Input de Mensagem */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Digite uma mensagem..."
          value={novaMensagem}
          onChangeText={setNovaMensagem}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!novaMensagem.trim() || enviando) && styles.sendButtonDisabled,
          ]}
          onPress={enviarMensagem}
          disabled={!novaMensagem.trim() || enviando}
        >
          {enviando ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="send" size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  mensagensList: {
    flex: 1,
  },
  mensagensContent: {
    padding: 15,
  },
  mensagemContainer: {
    marginBottom: 10,
  },
  mensagemEu: {
    alignItems: "flex-end",
  },
  mensagemOutro: {
    alignItems: "flex-start",
  },
  mensagemBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 4,
  },
  bubbleEu: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  bubbleOutro: {
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 4,
  },
  mensagemTexto: {
    fontSize: 16,
    lineHeight: 20,
  },
  textoEu: {
    color: "#FFF",
  },
  textoOutro: {
    color: "#000",
  },
  mensagemHora: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  horaEu: {
    color: "#E5F0FF",
    textAlign: "right",
  },
  horaOutro: {
    color: "#8E8E93",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 15,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#CCC",
  },
});
