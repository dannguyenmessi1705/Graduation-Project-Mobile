import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getUserInfo } from "../lib/apiService";
import type { UserInfo } from "../types/UserData";
import { Alert } from "react-native";

interface AuthContextType {
  isLoggedIn: boolean;
  userDetails: UserInfo | null;
  login: (token: string) => Promise<void>;
  register: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  handleExpiredToken: () => void;
  checkAuthAndRedirect: (navigation: any, actionName?: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userDetails: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  handleExpiredToken: () => {},
  checkAuthAndRedirect: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserInfo | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          setIsLoggedIn(true);
          const userInfo = await getUserInfo();
          setUserDetails(userInfo);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        await logout();
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (token: string) => {
    try {
      await SecureStore.setItemAsync("token", token);
      setIsLoggedIn(true);
      const userInfo = await getUserInfo();
      setUserDetails(userInfo);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (token: string) => {
    try {
      await SecureStore.setItemAsync("token", token);
      const userInfo = await getUserInfo();
      setUserDetails(userInfo);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setIsLoggedIn(false);
      setUserDetails(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const handleExpiredToken = () => {
    logout();
  };

  const checkAuthAndRedirect = (
    navigation: any,
    actionName = "this action"
  ): boolean => {
    if (isLoggedIn) {
      return true;
    }

    Alert.alert(
      "Authentication Required",
      `You need to be logged in to ${actionName}.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Login",
          onPress: () => navigation.navigate("Login"),
        },
      ],
      { cancelable: true }
    );

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userDetails,
        login,
        register,
        logout,
        handleExpiredToken,
        checkAuthAndRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
