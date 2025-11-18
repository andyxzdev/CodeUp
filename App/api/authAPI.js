// src/api/authAPI.js
import { api, setToken } from "./config";

export const authAPI = {
  async login(email, senha) {
    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      if (response.token) {
        setToken(response.token);
        // Salva no AsyncStorage também
        await AsyncStorage.setItem("userToken", response.token);
      }

      return response;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  },

  async cadastrar(usuarioData) {
    try {
      const response = await api.post("/usuarios", usuarioData);
      return response;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      throw error;
    }
  },
};
