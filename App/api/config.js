// api/config.js
const BASE_URL = "http://10.0.2.2:8080/api";

console.log("🔗 Config carregada - URL:", BASE_URL);

let token = null;

export const setToken = (newToken) => {
  token = newToken;
  console.log("🔑 Token definido:", token ? "SIM" : "NÃO");
};

export const api = {
  async get(endpoint) {
    try {
      console.log(`🚀 INICIANDO GET: ${BASE_URL}${endpoint}`);

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("🔐 Com token JWT");
      }

      console.log("📤 Headers:", headers);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
      });

      console.log("📥 Status:", response.status);
      console.log("📥 OK?", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("❌ Erro do servidor:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.text();
      console.log("✅ GET bem-sucedido:", data);
      return data;
    } catch (error) {
      console.error("💥 ERRO NO GET:", error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      console.log(`🚀 INICIANDO POST: ${BASE_URL}${endpoint}`, data);

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("🔐 Com token JWT");
      }

      console.log("📤 Headers:", headers);
      console.log("📤 Body:", JSON.stringify(data));

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      console.log("📥 Status:", response.status);
      console.log("📥 OK?", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("❌ Erro do servidor:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ POST bem-sucedido:", result);
      return result;
    } catch (error) {
      console.error("💥 ERRO NO POST:", error);
      throw error;
    }
  },
};
