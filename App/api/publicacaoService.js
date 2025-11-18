// App/api/publicacaoService.js
import { api } from "./config.js";

export const publicacaoService = {
  // Buscar feed de publicações
  async getFeed(page = 0, size = 10) {
    try {
      console.log(`📝 Buscando feed - página ${page}, tamanho ${size}`);

      const response = await api.get(
        `/publicacoes/feed?page=${page}&size=${size}`
      );
      return response;
    } catch (error) {
      console.error("❌ Erro ao buscar feed:", error);
      throw error;
    }
  },

  // Criar nova publicação
  async criarPublicacao(conteudo) {
    try {
      console.log("📝 Criando nova publicação:", conteudo);

      const response = await api.post("/publicacoes", {
        conteudo: conteudo,
      });

      console.log("✅ Publicação criada:", response);
      return response;
    } catch (error) {
      console.error("❌ Erro ao criar publicação:", error);
      throw error;
    }
  },

  // Curtir publicação
  async curtirPublicacao(publicacaoId) {
    try {
      console.log(`❤️ Curtindo publicação ${publicacaoId}`);

      // 🔥 IMPORTANTE: Seu backend espera usuarioId como param
      // Vamos precisar do userId do usuário logado
      const response = await api.post(
        `/publicacoes/${publicacaoId}/curtida?usuarioId=1`
      ); // Temporário

      console.log("✅ Publicação curtida:", response);
      return response;
    } catch (error) {
      console.error("❌ Erro ao curtir publicação:", error);
      throw error;
    }
  },

  // Salvar publicação
  async salvarPublicacao(publicacaoId) {
    try {
      console.log(`⭐ Salvando publicação ${publicacaoId}`);

      const response = await api.post(`/publicacoes/${publicacaoId}/salvar`);

      console.log("✅ Publicação salva:", response);
      return response;
    } catch (error) {
      console.error("❌ Erro ao salvar publicação:", error);
      throw error;
    }
  },

  // Buscar publicações de um usuário
  async getPublicacoesUsuario(usuarioId) {
    try {
      console.log(`👤 Buscando publicações do usuário ${usuarioId}`);

      const response = await api.get(`/publicacoes/usuario/${usuarioId}`);
      return response;
    } catch (error) {
      console.error("❌ Erro ao buscar publicações do usuário:", error);
      throw error;
    }
  },

  // Buscar publicação por ID
  async getPublicacao(id) {
    try {
      console.log(`🔍 Buscando publicação ${id}`);

      const response = await api.get(`/publicacoes/${id}`);
      return response;
    } catch (error) {
      console.error("❌ Erro ao buscar publicação:", error);
      throw error;
    }
  },
};
