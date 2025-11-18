// App/api/testConexao.js
import { testAPI } from "./testAPI.js";

export const testarConexaoBackend = async () => {
  try {
    console.log("🔌 Testando conexão com backend Java...");
    const resultado = await testAPI.testConnection();
    console.log("✅ CONEXÃO ESTABELECIDA!");
    return { sucesso: true, mensagem: resultado };
  } catch (error) {
    console.error("❌ FALHA NA CONEXÃO!");
    return { sucesso: false, erro: error.message };
  }
};
