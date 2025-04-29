import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TopicProvider } from "./contexts/TopicContext";
import { ChatProvider } from "./contexts/ChatContext";
import AppNavigator from "./navigation/AppNavigator";
import { LogBox } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

LogBox.ignoreLogs([
  "Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.",
]);

export default function App() {
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "#4BB543" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
        }}
        text2Style={{
          fontSize: 14,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "#FF3B30" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
        }}
        text2Style={{
          fontSize: 14,
        }}
      />
    ),
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ThemeProvider>
        <AuthProvider>
          <TopicProvider>
            <ChatProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
              <Toast config={toastConfig} />
            </ChatProvider>
          </TopicProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
