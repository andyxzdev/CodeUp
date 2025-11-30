import { api } from "./config";

export const comentarioService = {
  async listar(publicacaoId) {
    const res = await api.get(`/comentarios/publicacao/${publicacaoId}`);
    return res.data;
  },

  async criar(publicacaoId, conteudo) {
    const res = await api.post("/comentarios", {
      publicacaoId,
      conteudo,
    });
    return res.data;
  },
};
