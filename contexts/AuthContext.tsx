import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getUserInfo } from "../lib/api";
import type { UserInfo } from "../types/UserData";

interface AuthContextType {
  isLoggedIn: boolean;
  userDetails: UserInfo | null;
  login: (token: string) => Promise<void>;
  register: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  handleExpiredToken: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userDetails: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  handleExpiredToken: () => {},
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

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userDetails, login, register, logout, handleExpiredToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
