// api/authService.js
import { api, setToken } from "./config"; // Importa do config.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  async login(email, senha) {
    try {
      console.log("🔐 Tentando login:", email);

      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      if (response.sucesso && response.dados.token) {
        const token = response.dados.token;
        const usuario = response.dados.usuario;

        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userData", JSON.stringify(usuario));
        setToken(token);

        console.log("✅ Login realizado:", usuario.nome);
        return { sucesso: true, usuario, token };
      } else {
        throw new Error(response.mensagem || "Erro no login");
      }
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  },

  async cadastrar(usuarioData) {
    try {
      const response = await api.post("/usuarios", usuarioData);
      return response;
    } catch (error) {
      console.error("❌ Erro no cadastro:", error);
      throw error;
    }
  },

  async logout() {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    setToken(null);
  },

  async getToken() {
    return await AsyncStorage.getItem("userToken");
  },

  async getUser() {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  },
};
