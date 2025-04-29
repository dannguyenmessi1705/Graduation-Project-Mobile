import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TopicProvider } from "./contexts/TopicContext";
import AppNavigator from "./navigation/AppNavigator";
import { initializeEnvironmentVariables } from "./lib/env";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo biến môi trường khi ứng dụng khởi động
  useEffect(() => {
    async function initialize() {
      try {
        await initializeEnvironmentVariables();
      } catch (error) {
        console.error("Failed to initialize environment variables:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: "#fff" }]}>
        <Text>Đang khởi tạo...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <TopicProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <AppNavigator />
              <Toast />
            </NavigationContainer>
          </TopicProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
