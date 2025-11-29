// api/notificacaoService.js
import { api } from "./config";

export const notificacaoService = {
  async listar() {
    const res = await api.get("/notificacoes");

    // SE vier formato padrão {sucesso, dados, mensagem}
    if (res?.dados) return res.dados;

    // fallback (array puro)
    if (Array.isArray(res)) return res;

    console.log("⚠️ Resposta inesperada:", res);
    return [];
  },

  async marcarComoLida(id) {
    return api.post(`/notificacoes/${id}/lida`);
  },
};
