import { api, setToken } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authAPI = {
  async login(email, senha) {
    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      // resposta real vem dentro de response.data.dados.token
      const token = response.data?.dados?.token;

      if (token) {
        setToken(token);
        await AsyncStorage.setItem("userToken", token);
      }

      return response.data;
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  },

  async cadastrar(usuarioData) {
    try {
      const response = await api.post("/usuarios", usuarioData);
      return response.data;
    } catch (error) {
      console.error("❌ Erro no cadastro:", error);
      throw error;
    }
  },
};
