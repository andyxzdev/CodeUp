// App/api/authService.js
import { api, setToken } from "./config.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  async login(email, senha) {
    try {
      console.log("🔐 Tentando login real...", email);

      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      console.log("📦 Resposta completa do login:", response);

      // 🔥 CORREÇÃO: Verificar se token existe
      const token = response.dados?.token;
      const usuario = response.dados?.usuario;

      if (response.sucesso && usuario) {
        // Se token for null, ainda permite login (para teste)
        if (token) {
          await AsyncStorage.setItem("userToken", token);
          setToken(token);
        } else {
          console.warn(
            "⚠️ Token não recebido do backend, continuando sem token"
          );
        }

        await AsyncStorage.setItem("userData", JSON.stringify(usuario));

        console.log("✅ Login realizado com sucesso:", usuario.nome);
        return {
          sucesso: true,
          usuario,
          token,
          mensagem: response.mensagem,
        };
      } else {
        throw new Error(response.mensagem || "Erro no login");
      }
    } catch (error) {
      console.error("❌ Erro no login real:", error);
      throw error;
    }
  },

  async cadastrar(nome, email, senha) {
    try {
      console.log("📝 Criando novo usuário...", email);

      const response = await api.post("/usuarios/registrar", {
        nome,
        email,
        senha,
      });

      console.log("📦 Resposta do cadastro:", response);

      // Seu endpoint retorna só os dados do usuário, sem token
      // Então precisamos fazer login depois do cadastro
      if (response.id) {
        console.log("✅ Usuário criado com ID:", response.id);

        // Agora faz login automaticamente
        const loginResult = await this.login(email, senha);
        return loginResult;
      } else {
        throw new Error("Erro ao criar usuário");
      }
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
