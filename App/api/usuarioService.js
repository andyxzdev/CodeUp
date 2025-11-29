// api/usuarioService.js
import { api } from "./config.js";

export const usuarioService = {
  async getPerfil(usuarioId) {
    try {
      if (!usuarioId) throw new Error("ID do usuário inválido");
      const id = Number(usuarioId);
      const res = await api.get(`/usuarios/${id}`);
      // Se backend padrão: {sucesso, mensagem, dados}
      if (res?.sucesso && res.dados) return res.dados;
      // se retorno direto do usuário
      if (res?.id) return res;
      // fallback
      return null;
    } catch (error) {
      console.error("💥 usuarioService.getPerfil:", error);
      return null;
    }
  },

  async atualizarPerfil(usuarioId, dados) {
    try {
      const res = await api.put(`/usuarios/${usuarioId}/perfil`, dados);
      if (res?.sucesso) return res.dados;
      return res;
    } catch (error) {
      console.error("💥 usuarioService.atualizarPerfil:", error);
      throw error;
    }
  },

  async getPublicacoesUsuario(usuarioId) {
    try {
      const res = await api.get(`/publicacoes/usuario/${usuarioId}`);
      return res?.dados ?? res;
    } catch (error) {
      console.error("💥 usuarioService.getPublicacoesUsuario:", error);
      throw error;
    }
  },

  async getPublicacoesSalvas(usuarioId) {
    try {
      const res = await api.get(`/usuarios/${usuarioId}/salvos`);
      return res?.dados ?? res;
    } catch (error) {
      console.error("💥 usuarioService.getPublicacoesSalvas:", error);
      throw error;
    }
  },

  // retorna sempre um array []
  async buscarUsuarios() {
    try {
      const res = await api.get("/usuarios");
      // backend padrão {sucesso:true, dados: [...]}
      if (res?.sucesso && Array.isArray(res.dados)) return res.dados;
      // se retorno for array puro
      if (Array.isArray(res)) return res;
      // se backend devolve {dados: [...]}
      if (res?.dados && Array.isArray(res.dados)) return res.dados;
      // se for objeto com dados em res.data
      if (res?.data && Array.isArray(res.data)) return res.data;
      console.warn("usuarioService.buscarUsuarios: resposta inesperada:", res);
      return [];
    } catch (error) {
      console.error("💥 usuarioService.buscarUsuarios:", error);
      return [];
    }
  },

  // buscar por nome (usa buscarUsuarios)
  async buscarUsuariosPorNome(nome) {
    try {
      if (!nome || !nome.trim()) return await this.buscarUsuarios();
      const todos = await this.buscarUsuarios();
      return todos.filter((u) => {
        const n = (u.nome || "").toString().toLowerCase();
        const e = (u.email || "").toString().toLowerCase();
        const q = nome.toLowerCase();
        return n.includes(q) || e.includes(q);
      });
    } catch (error) {
      console.error("💥 usuarioService.buscarUsuariosPorNome:", error);
      return [];
    }
  },
};

export default usuarioService;
