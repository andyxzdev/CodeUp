// api/mensagemService.js
import { api } from "./config";

export const mensagemService = {
  enviarMensagem(remetenteId, destinatarioId, conteudo) {
    return api.post("/chat/enviar", {
      remetenteId,
      destinatarioId,
      conteudo,
    });
  },

  carregarConversa(usuario1, usuario2) {
    return api.get(`/chat/conversa?usuario1=${usuario1}&usuario2=${usuario2}`);
  },

  carregarConversasRecentes(usuarioId) {
    return api.get(`/chat/conversas-recentes/${usuarioId}`);
  },
};
