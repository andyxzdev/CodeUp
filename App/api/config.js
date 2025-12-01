// api/config.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "http://10.0.10.171:8080/api";
console.log("🔗 API BASE:", BASE_URL);

export let token = null;

export const setToken = (newToken) => {
  token = newToken;
  console.log("🔑 Token atualizado:", token ? "OK" : "VAZIO");
};

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

async function parseResponse(response) {
  const text = await response.text();
  console.log(`📥 RAW (${response.status}):`, text);

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  async get(endpoint) {
    console.log(`📡 GET ${BASE_URL}${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await parseResponse(response);
  },

  async post(endpoint, body) {
    console.log(`📡 POST ${BASE_URL}${endpoint}`, body);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await parseResponse(response);
  },

  async put(endpoint, body) {
    console.log(`📡 PUT ${BASE_URL}${endpoint}`, body);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await parseResponse(response);
  },

  async delete(endpoint) {
    console.log(`📡 DELETE ${BASE_URL}${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await parseResponse(response);
  },
};
