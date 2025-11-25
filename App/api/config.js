// api/config.js
const BASE_URL = "http://10.0.2.2:8080/api";

console.log("🔗 Config carregada - URL:", BASE_URL);

let token = null;

export const setToken = (newToken) => {
  token = newToken;
  console.log("🔑 Token definido:", token ? "SIM" : "NÃO");
};

async function parseResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text); // tenta converter para JSON
  } catch {
    console.log("⚠ Resposta NÃO é JSON. Conteúdo cru:", text);
    return {
      sucesso: false,
      mensagem: text,
      dados: null,
    };
  }
}

export const api = {
  async get(endpoint) {
    try {
      console.log(`🚀 GET: ${BASE_URL}${endpoint}`);

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
      });

      const result = await parseResponse(response);
      console.log("📥 Resultado GET:", result);

      return result;
    } catch (error) {
      console.error("💥 ERRO NO GET:", error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      console.log(`🚀 POST: ${BASE_URL}${endpoint}`);

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      const result = await parseResponse(response);
      console.log("📥 Resultado POST:", result);

      return result;
    } catch (error) {
      console.error("💥 ERRO NO POST:", error);
      throw error;
    }
  },
};
