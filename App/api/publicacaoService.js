// api/publicacaoService.js
import { api, token as tokenGlobal, BASE_URL } from "./config.js";

export const publicacaoService = {
  async getFeed(page = 0, size = 10) {
    return await api.get(`/publicacoes/feed?page=${page}&size=${size}`);
  },

  async criarPublicacao({ conteudo, imagemUri }) {
    try {
      console.log("📝 Criando nova publicação");

      const token = tokenGlobal; // pega token real
      console.log("🔑 Token usado no upload:", token);

      const formData = new FormData();
      formData.append("conteudo", conteudo);

      if (imagemUri) {
        const filename = imagemUri.split("/").pop();
        const ext = filename.split(".").pop().toLowerCase();

        const mime =
          ext === "png"
            ? "image/png"
            : ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : "image/*";

        formData.append("imagem", {
          uri: imagemUri,
          name: filename,
          type: mime,
        });
      }

      const response = await fetch(`${BASE_URL}/publicacoes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const raw = await response.text();
      console.log("📥 RAW multipart:", raw);

      return JSON.parse(raw);
    } catch (err) {
      console.log("❌ Erro ao criar publicação:", err);
      throw err;
    }
  },

  async curtirPublicacao(id) {
    return await api.post(`/publicacoes/${id}/curtida`);
  },

  async salvarPublicacao(id) {
    return await api.post(`/publicacoes/${id}/salvar`);
  },

  async getPublicacoesUsuario(usuarioId) {
    return await api.get(`/publicacoes/usuario/${usuarioId}`);
  },

  async getPublicacao(id) {
    return await api.get(`/publicacoes/${id}`);
  },
};
