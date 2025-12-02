// api/config.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://unperuked-camren-weedily.ngrok-free.dev/api";
//export const BASE_URL = "http://10.0.10.171:8080/api";
console.log("🔗 API BASE:", BASE_URL);

export let token = null;

export const setToken = (newToken) => {
  token = newToken;
  console.log("🔑 Token atualizado:", token ? "OK" : "VAZIO");
};

// ===============================================
// ❗ NÃO definir Content-Type se body for FormData
// ===============================================

//const getHeaders = (body) => {
// const headers = {};

// if (!(body instanceof FormData)) {
//    headers["Content-Type"] = "application/json";
// }

// if (token) headers["Authorization"] = `Bearer ${token}`;

// return headers;
//};

const getHeaders = (body) => {
  const headers = {
    "ngrok-skip-browser-warning": "true",
  };

  // ❌ NÃO DEFINIR Content-Type se for FormData
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

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

async function get(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await parseResponse(response);
}

//async function post(endpoint, body) {
//const response = await fetch(`${BASE_URL}${endpoint}`, {
//  method: "POST",
// headers: getHeaders(body),
// body: body instanceof FormData ? body : JSON.stringify(body),
//});
//if (!response.ok) throw new Error(`HTTP ${response.status}`);
// return await parseResponse(response);
//}

async function post(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(body),
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await parseResponse(response);
}

async function put(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await parseResponse(response);
}

async function del(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await parseResponse(response);
}

// usado para comentários (texto puro)
async function postTexto(endpoint, texto) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: texto,
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await parseResponse(response);
}

export const api = {
  get,
  post,
  postTexto,
  put,
  delete: del,
};
