// api/config.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.0.2.2:8080/api";

console.log("🔗 API BASE:", BASE_URL);

let token = null;

// Atualiza token globalmente
export const setToken = (newToken) => {
  token = newToken;
  console.log("🔑 Token atualizado:", token ? "OK" : "VAZIO");
};

// Gera headers
const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export const api = {
  async get(endpoint) {
    console.log(`📡 GET ${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const text = await response.text();
    console.log("📥 GET RAW:", text);

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("❌ ERRO AO PARSEAR JSON:", e, text);
      throw e;
    }
  },

  async post(endpoint, body) {
    console.log(`📡 POST ${BASE_URL}${endpoint}`, body);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log("📥 POST RAW:", text);

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("❌ ERRO AO PARSEAR JSON:", e, text);
      throw e;
    }
  },

  async put(endpoint, body) {
    console.log(`📡 PUT ${BASE_URL}${endpoint}`, body);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log("📥 PUT RAW:", text);

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("❌ ERRO AO PARSEAR JSON:", e, text);
      throw e;
    }
  },

  async delete(endpoint) {
    console.log(`📡 DELETE ${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const text = await response.text();
    console.log("📥 DELETE RAW:", text);

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("❌ ERRO AO PARSEAR JSON:", e, text);
      throw e;
    }
  },
};
