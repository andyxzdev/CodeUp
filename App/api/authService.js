// App/api/authService.js
import { api, setToken } from "./config.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  //------------------------------------------------------------
  // LOGIN
  //------------------------------------------------------------
  async login(email, senha) {
    try {
      console.log("🔐 Tentando login real...", email);

      const response = await api.post("/auth/login", { email, senha });

      console.log("📦 Resposta completa do login:", response);

      if (!response?.sucesso) {
        throw new Error(response?.mensagem || "Falha no login");
      }

      const token = response?.dados?.token;
      const usuario = response?.dados?.usuario;

      if (!usuario) {
        throw new Error("Usuário não retornado pelo backend");
      }

      // Salva token se existir
      if (token) {
        await AsyncStorage.setItem("userToken", token);
        setToken(token);
      } else {
        console.warn("⚠️ Login sem token — backend não enviou.");
      }

      // Salva usuário
      await AsyncStorage.setItem("userData", JSON.stringify(usuario));

      console.log("✅ Login realizado:", usuario.nome);

      return {
        sucesso: true,
        usuario,
        token,
        mensagem: response.mensagem,
      };
    } catch (error) {
      console.error("❌ Erro no login real:", error);
      throw error;
    }
  },

  //------------------------------------------------------------
  // CADASTRO
  //------------------------------------------------------------
  async cadastrar(nome, email, senha) {
    try {
      console.log("📝 Criando novo usuário...", email);

      const response = await api.post("/usuarios/registrar", {
        nome,
        email,
        senha,
      });

      console.log("📦 Resposta do cadastro:", response);

      if (!response?.sucesso) {
        throw new Error(response?.mensagem || "Erro ao criar usuário");
      }

      const usuarioCriado = response?.dados;

      if (!usuarioCriado?.id) {
        throw new Error("Backend não retornou ID do usuário");
      }

      console.log("✅ Usuário criado com ID:", usuarioCriado.id);

      // Login automático
      return await this.login(email, senha);
    } catch (error) {
      console.error("❌ Erro no cadastro:", error);
      throw error;
    }
  },

  //------------------------------------------------------------
  // LOGOUT
  //------------------------------------------------------------
  async logout() {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    setToken(null);
  },

  //------------------------------------------------------------
  // GETTERS
  //------------------------------------------------------------
  async getToken() {
    return await AsyncStorage.getItem("userToken");
  },

  async getUser() {
    const json = await AsyncStorage.getItem("userData");
    return json ? JSON.parse(json) : null;
  },
};
