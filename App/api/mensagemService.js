import { api } from "./config.js";

export const mensagemService = {
  // Enviar mensagem
  async enviar(mensagemData) {
    try {
      console.log("📤 Enviando mensagem:", mensagemData);

      const response = await api.post("/chat/enviar", mensagemData);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error);
      throw error;
    }
  },

  // Buscar conversa entre dois usuários
  async getConversa(usuario1, usuario2) {
    try {
      console.log(`💬 Buscando conversa entre ${usuario1} e ${usuario2}`);

      const response = await api.get("/chat/conversa", {
        params: { usuario1, usuario2 },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar conversa:", error);
      throw error;
    }
  },

  // Buscar conversas recentes do usuário
  async getConversasRecentes(usuarioId) {
    try {
      console.log(`📋 Buscando conversas recentes do usuário ${usuarioId}`);

      const response = await api.get(`/chat/conversas-recentes/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar conversas recentes:", error);
      throw error;
    }
  },
};
