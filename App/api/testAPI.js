// App/api/testAPI.js
import { api } from "./config.js";

export const testAPI = {
  async testConnection() {
    try {
      console.log("🧪 Iniciando teste de conexão...");
      const result = await api.get("/test/conexao");
      return result;
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      throw error;
    }
  },
};
