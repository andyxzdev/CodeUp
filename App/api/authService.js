// App/api/authService.js
import { api, setToken } from "./config.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  async login(email, senha) {
    try {
      console.log("🔐 Tentando login real...", email);

      // Chama o SEU AuthController do Spring
      const response = await api.post("/auth/login", {
        email,
        senha, // Note: seu backend espera "senha", não "password"
      });

      console.log("📦 Resposta completa do login:", response);

      // Sua resposta do Spring tem esta estrutura:
      // {
      //   "sucesso": true,
      //   "mensagem": "Login bem-sucedido",
      //   "dados": {
      //     "token": "jwt_token_aqui",
      //     "usuario": {
      //       "id": 1,
      //       "nome": "Nome do Usuário",
      //       "email": "email@exemplo.com"
      //     }
      //   }
      // }

      if (response.sucesso && response.dados.token) {
        const token = response.dados.token;
        const usuario = response.dados.usuario;

        // Salva token e usuário no AsyncStorage
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userData", JSON.stringify(usuario));
        setToken(token);

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
