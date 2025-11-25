import React, { createContext, useState, useContext } from "react";
import { Alert } from "react-native";

//Dados iciciais
const INITIAL_PROFILE_DATA = {
  username: "Caio.developer",
  name: "Caio Developer",
  bio: "Desenvolvimento Mobile | React Native | Expo 🚀",
  avatar: require("../../../assets/user1.jpg"),
  // avatar: null,
};

//coloque a api aqui.
const API_URL = "http://seu.dominio.com.br/api/user/profile";

//Criação de contexto
export const ProfileContext = createContext();

//Porvedor de contexto
export const ProfileProvider = ({ children }) => {
  //Estado central que guardará os dados do perfil
  const [profileData, setProfileData] = useState(INITIAL_PROFILE_DATA);

  const updateProfile = async (newProfileData) => {
    const dataToSend = {
      ...profileData,
      ...newProfileData,
    };
    // Lógica de conexão com o backend
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error(
          "Falha ao carregar no servidor. status: " + response.status
        );
      }

      setProfileData(dataToSend);
      Alert.alert("Sucesso", "Seu Perfil Foi Atualizado");
    } catch (error) {
      console.error("Error ao salvar o perfil", error);
      Alert.alert("Error", "Não foi possivel salvar, Verifique sua conexão.");
      //O estado não muda se o backend falhar.
    }
  };
  return (
    //Define os que as telas podem consumir
    <ProfileContext.Provider value={{ profileData, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
export const useProfile = () => useContext(ProfileContext);
