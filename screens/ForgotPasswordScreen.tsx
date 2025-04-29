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
import { useTheme } from "../contexts/ThemeContext";
import { requestResetPassword } from "@/lib/apiService";
import Toast from "react-native-toast-message";

type RootStackParamList = {
  Login: undefined;
};

type ForgotPasswordScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function ForgotPasswordScreen() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { colors } = useTheme();

  const handleResetPassword = async () => {
    if (!username) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your username or email",
      });
      return;
    }

    setIsLoading(true);

    try {
      await requestResetPassword(username);
      setSuccess(true);
      Toast.show({
        type: "success",
        text1: "Request submitted",
        text2:
          "If the account exists, password reset instructions will be sent",
      });
    } catch (error) {
      // We don't show specific errors to avoid leaking information about account existence
      Toast.show({
        type: "info",
        text1: "Request processed",
        text2:
          "If the account exists, password reset instructions will be sent",
      });
    } finally {
      setIsLoading(false);
    }
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
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 20,
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
    resetButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 20,
    },
    resetButtonText: {
      color: colors.primaryText,
      fontSize: 16,
      fontWeight: "600",
    },
    backToLoginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    backToLoginText: {
      color: colors.text,
      fontSize: 14,
    },
    backToLoginLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 5,
    },
    successContainer: {
      padding: 20,
      alignItems: "center",
    },
    successText: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 24,
    },
  });

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.successText}>
            If an account exists with the username you provided, we've sent
            instructions to reset your password.
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.resetButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Z'Forum</Text>
          </View>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={{ ...styles.successText, marginBottom: 30 }}>
            Enter your username and we'll send you instructions to reset your
            password.
          </Text>

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

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primaryText} />
            ) : (
              <Text style={styles.resetButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          <View style={styles.backToLoginContainer}>
            <Text style={styles.backToLoginText}>Remember your password?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.backToLoginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
