import { api } from "./config.js";

export const usuarioService = {
  async getPerfil(usuarioId) {
    try {
      console.log(
        `🔍 Service: Buscando perfil do usuário ${usuarioId} (tipo: ${typeof usuarioId})`
      );

      if (!usuarioId || usuarioId === "undefined" || usuarioId === "null") {
        console.log("❌ ID inválido no service");
        throw new Error("ID do usuário inválido");
      }

      const id = Number(usuarioId);

      console.log(`👤 Fazendo requisição para /usuarios/${id}`);
      const response = await api.get(`/usuarios/${id}`);

      console.log("🔥 Resposta COMPLETA do backend:", response);
      console.log("🔥 Data:", response.data);

      return response.data;
    } catch (error) {
      console.error("💥 Erro COMPLETO no service:", error);
      console.log("💥 Erro response:", error.response?.data);

      return {
        sucesso: false,
        mensagem: "Erro ao carregar perfil",
        dados: null,
      };
    }
  },

  async atualizarPerfil(usuarioId, dados) {
    try {
      console.log(`✏️ Atualizando perfil do usuário ${usuarioId}`, dados);

      const response = await api.put(`/usuarios/${usuarioId}/perfil`, dados);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao atualizar perfil:", error);
      throw error;
    }
  },

  async getPublicacoesUsuario(usuarioId) {
    try {
      console.log(`📝 Buscando publicações do usuário ${usuarioId}`);

      const response = await api.get(`/publicacoes/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar publicações do usuário:", error);
      throw error;
    }
  },

  async getPublicacoesSalvas(usuarioId) {
    try {
      console.log(`⭐ Buscando publicações salvas do usuário ${usuarioId}`);

      const response = await api.get(`/usuarios/${usuarioId}/salvos`);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar publicações salvas:", error);
      throw error;
    }
  },

  async buscarUsuarios() {
    try {
      console.log("👥 Buscando lista de usuários...");

      const response = await api.get("/usuarios");
      console.log("📦 Resposta usuários:", response);

      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error);
      throw error;
    }
  },

  async buscarUsuariosPorNome(nome) {
    try {
      console.log(`🔍 Buscando usuários por nome: ${nome}`);

      const response = await api.get("/usuarios");
      const usuarios = response.data.dados || response.data;

      const usuariosFiltrados = usuarios.filter(
        (usuario) =>
          usuario.nome.toLowerCase().includes(nome.toLowerCase()) ||
          usuario.email.toLowerCase().includes(nome.toLowerCase())
      );

      return usuariosFiltrados;
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error);
      throw error;
    }
  },
};
