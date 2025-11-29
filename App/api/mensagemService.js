// api/mensagemService.js
import { api } from "./config";

export const mensagemService = {
  // ======================
  // ENVIAR MENSAGEM
  // ======================
  async enviar({ remetenteId, destinatarioId, conteudo }) {
    const res = await api.post("/chat/enviar", {
      remetenteId,
      destinatarioId,
      conteudo,
    });

    return res; // mantém padrão da API
  },

  // ======================
  // CARREGAR MENSAGENS DO CHAT
  // ======================
  async getConversa(remetenteId, destinatarioId) {
    const resposta = await api.get(
      `/chat/conversa?usuario1=${remetenteId}&usuario2=${destinatarioId}`
    );

    // 🔥 ESTE ENDPOINT RETORNA ARRAY PURO
    if (Array.isArray(resposta)) return resposta;

    console.warn("⚠️ Resposta inesperada em getConversa:", resposta);
    return [];
  },

  // ======================
  // CARREGAR CONVERSAS RECENTES
  // ======================
  async getConversasRecentes(usuarioId) {
    const resposta = await api.get(`/chat/conversas-recentes/${usuarioId}`);

    // 🔥 API padrão
    if (resposta?.sucesso && Array.isArray(resposta.dados)) {
      return {
        sucesso: true,
        dados: resposta.dados,
      };
    }

    // 🔥 Caso raro: backend retornou ARRAY PURO
    if (Array.isArray(resposta)) {
      return {
        sucesso: true,
        dados: resposta,
      };
    }

    console.warn("⚠️ Resposta inesperada em conversas-recentes:", resposta);

    return {
      sucesso: false,
      dados: [],
    };
  },
};
