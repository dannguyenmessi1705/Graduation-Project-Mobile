import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
type ThemeType = "light" | "dark" | "lunar-new-year";

interface ThemeColors {
  background: string;
  text: string;
  card: string;
  cardText: string;
  primary: string;
  primaryText: string;
  secondary: string;
  secondaryText: string;
  border: string;
  muted: string;
  mutedText: string;
  error: string;
  errorText: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: "#F8FAFC",
  text: "#0F172A",
  card: "#FFFFFF",
  cardText: "#0F172A",
  primary: "#3B82F6",
  primaryText: "#FFFFFF",
  secondary: "#F1F5F9",
  secondaryText: "#1E293B",
  border: "#E2E8F0",
  muted: "#F1F5F9",
  mutedText: "#64748B",
  error: "#EF4444",
  errorText: "#FFFFFF",
};

const darkColors: ThemeColors = {
  background: "#0F172A",
  text: "#F8FAFC",
  card: "#1E293B",
  cardText: "#F8FAFC",
  primary: "#3B82F6",
  primaryText: "#0F172A",
  secondary: "#334155",
  secondaryText: "#F8FAFC",
  border: "#334155",
  muted: "#334155",
  mutedText: "#94A3B8",
  error: "#EF4444",
  errorText: "#FFFFFF",
};

const lunarNewYearColors: ThemeColors = {
  background: "#FFF5F5",
  text: "#000000",
  card: "#FFFFFF",
  cardText: "#000000",
  primary: "#DC2626",
  primaryText: "#FFFFFF",
  secondary: "#FFEDD5",
  secondaryText: "#DC2626",
  border: "#FECACA",
  muted: "#FEF2F2",
  mutedText: "#7F1D1D",
  error: "#B91C1C",
  errorText: "#FFFFFF",
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  colors: lightColors,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceTheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>("light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync("theme");
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        } else {
          setThemeState(deviceTheme === "dark" ? "dark" : "light");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };

    loadTheme();
  }, [deviceTheme]);

  const setTheme = async (newTheme: ThemeType) => {
    try {
      await SecureStore.setItemAsync("theme", newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const getColors = () => {
    switch (theme) {
      case "dark":
        return darkColors;
      case "lunar-new-year":
        return lunarNewYearColors;
      default:
        return lightColors;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: getColors() }}>
      {children}
    </ThemeContext.Provider>
  );
};
