import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { login } from "@/lib/apiService";
import Toast from "react-native-toast-message";

// Define the navigation type for LoginScreen
type RootStackParamList = {
  Main: undefined;
  Register: undefined;
  // Add other screens as needed
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login: authLogin } = useAuth();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter both username and password",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(username, password);
      await authLogin(response.data.access_token);
      Toast.show({
        type: "success",
        text1: "Login successful",
        text2: "You have been successfully logged in.",
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });

      // if (response.ok) {
      //   await login(data.data.access_token);
      //   Toast.show({
      //     type: "success",
      //     text1: "Login successful",
      //     text2: "You have been successfully logged in.",
      //   });
      // } else {
      //   throw new Error(data.status.message || "Login failed");
      // }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2:
          error instanceof Error
            ? error.message
            : "An error occurred during login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
    },
    content: {
      padding: 20,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      fontSize: 36,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 10,
    },
    tagline: {
      fontSize: 16,
      color: colors.mutedText,
      textAlign: "center",
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 20,
    },
    forgotPasswordText: {
      color: colors.primary,
      fontSize: 14,
    },
    loginButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 20,
    },
    loginButtonText: {
      color: colors.primaryText,
      fontSize: 16,
      fontWeight: "600",
    },
    registerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    registerText: {
      color: colors.text,
      fontSize: 14,
    },
    registerLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 5,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <TouchableOpacity
              onLongPress={() => navigation.navigate("Debug" as never)}
              delayLongPress={2000}
            >
              <Text style={styles.logo}>Z'Forum</Text>
            </TouchableOpacity>
            <Text style={styles.tagline}>Connect with your community</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              placeholderTextColor={colors.mutedText}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.mutedText}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() =>
              alert("Forgot password functionality would be implemented here")
            }
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primaryText} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
