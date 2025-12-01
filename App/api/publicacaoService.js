// api/publicacaoService.js
import { api, token as tokenGlobal, BASE_URL } from "./config.js";

export const publicacaoService = {
  async getFeed(page = 0, size = 20) {
    return await api.get(`/publicacoes/feed?page=${page}&size=${size}`);
  },

  async criarPublicacao({ conteudo, imagemUri, imagemName, imagemType }) {
    try {
      console.log("📝 Criando nova publicação");
      const formData = new FormData();

      formData.append("conteudo", conteudo);

      if (imagemUri) {
        formData.append("imagem", {
          uri: imagemUri,
          name: imagemName || imagemUri.split("/").pop(),
          type: imagemType || "image/jpeg",
        });
      }

      return await api.post("/publicacoes", formData);
    } catch (err) {
      console.log("❌ Erro ao criar publicação:", err);
      throw err;
    }
  },

  // =============== CURTIR ===============
  async curtir(id) {
    return await api.post(`/publicacoes/${id}/curtida`, {});
  },

  async descurtir(id) {
    return await api.delete(`/publicacoes/${id}/curtida`);
  },

  // =============== SALVAR ===============
  async salvar(id) {
    return await api.post(`/publicacoes/${id}/salvar`, {});
  },

  async removerSalvar(id) {
    return await api.delete(`/publicacoes/${id}/salvar`);
  },

  // =============== COMENTÁRIOS ===============
  async comentar(id, texto) {
    return await api.postTexto(`/publicacoes/${id}/comentarios`, texto);
  },

  async listarComentarios(id) {
    return await api.get(`/publicacoes/${id}/comentarios`);
  },
};
