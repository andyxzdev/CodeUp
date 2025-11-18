// App/hooks/useAuth.js
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
      const user = await authService.getUser();
      const token = await authService.getToken();

      if (user && token) {
        setUsuario(user);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const resultado = await authService.login(email, senha);
      setUsuario(resultado.usuario);
      return resultado;
    } catch (error) {
      throw error;
    }
  };

  return {
    usuario,
    carregando,
    login,
  };
};
