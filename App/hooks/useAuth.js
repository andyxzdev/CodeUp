import { useState, useEffect } from "react";
import { authService } from "../api/authService.js";

export const useAuth = () => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    try {
      console.log("🔄 useAuth - Iniciando carregamento do usuário...");

      const user = await authService.getUser();
      const token = await authService.getToken();

      console.log("📦 useAuth - Usuário do AsyncStorage:", user);
      console.log("🔑 useAuth - Token do AsyncStorage:", token);

      if (user) {
        console.log("✅ useAuth - Usuário encontrado:", user.nome);
        setUsuario(user);
      } else {
        console.log("❌ useAuth - NENHUM usuário encontrado no AsyncStorage");
        setUsuario(null);
      }
    } catch (error) {
      console.error("💥 useAuth - Erro ao carregar usuário:", error);
      setUsuario(null);
    } finally {
      console.log("🏁 useAuth - Carregamento finalizado");
      setCarregando(false);
    }
  };

  const login = async (email, senha) => {
    try {
      console.log("🔐 useAuth - Iniciando login...");
      const resultado = await authService.login(email, senha);

      if (resultado.sucesso && resultado.usuario) {
        console.log("✅ useAuth - Login bem-sucedido:", resultado.usuario.nome);
        setUsuario(resultado.usuario);
      } else {
        console.log("❌ useAuth - Login falhou");
        setUsuario(null);
      }

      return resultado;
    } catch (error) {
      console.error("💥 useAuth - Erro no login:", error);
      setUsuario(null);
      throw error;
    }
  };

  const logout = async () => {
    console.log("🚪 useAuth - Fazendo logout...");
    await authService.logout();
    setUsuario(null);
  };

  return {
    usuario,
    carregando,
    login,
    logout,
  };
};

export default useAuth;
