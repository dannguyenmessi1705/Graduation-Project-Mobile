import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  API_GEMINI_URL,
  API_BASE_URL,
  USE_MOCK_API,
  GEMINI_API_KEY,
  initializeEnvironmentVariables,
} from "../lib/env";
import {
  setEnvironmentVariable,
  resetEnvironmentVariables,
} from "../lib/envManager";
import { getMaskedApiKey } from "../lib/debugEnv";
import { generateAIResponse } from "../lib/gemini";

export default function DebugScreen() {
  const { colors } = useTheme();
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for form inputs
  const [apiBaseUrl, setApiBaseUrl] = useState(API_BASE_URL);
  const [geminiApiUrl, setGeminiApiUrl] = useState(API_GEMINI_URL);
  const [geminiApiKey, setGeminiApiKey] = useState(GEMINI_API_KEY);
  const [useMockApi, setUseMockApi] = useState(USE_MOCK_API);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Load current environment values
  useEffect(() => {
    loadEnvironmentVariables();
  }, []);

  const loadEnvironmentVariables = async () => {
    const env = await initializeEnvironmentVariables();
    setApiBaseUrl(env.API_BASE_URL);
    setGeminiApiUrl(env.API_GEMINI_URL);
    setGeminiApiKey(env.GEMINI_API_KEY);
    setUseMockApi(env.USE_MOCK_API);
  };

  const testGeminiAPI = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const response = await generateAIResponse(
        "Hello, please respond with a short greeting."
      );
      setTestResult(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await setEnvironmentVariable("API_BASE_URL", apiBaseUrl);
      await setEnvironmentVariable("API_GEMINI_URL", geminiApiUrl);
      await setEnvironmentVariable("GEMINI_API_KEY", geminiApiKey);
      await setEnvironmentVariable(
        "USE_MOCK_API",
        useMockApi ? "true" : "false"
      );

      // Reload environment variables
      await initializeEnvironmentVariables();

      Alert.alert(
        "Settings Saved",
        "Environment variables have been updated. Some changes may require restarting the app to take full effect.",
        [{ text: "OK" }]
      );
    } catch (err) {
      Alert.alert("Error", "Failed to save environment variables", [
        { text: "OK" },
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    Alert.alert(
      "Reset to Defaults",
      "Are you sure you want to reset all environment variables to their default values?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setIsSaving(true);
            try {
              await resetEnvironmentVariables();
              await loadEnvironmentVariables();
              Alert.alert(
                "Reset Successful",
                "All environment variables have been reset to their default values."
              );
            } catch (err) {
              Alert.alert("Error", "Failed to reset environment variables");
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {isSaving && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 10 }}>Saving...</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Environment Variables
        </Text>

        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.mutedText }]}>
            API Base URL:
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, backgroundColor: colors.background },
            ]}
            value={apiBaseUrl}
            onChangeText={setApiBaseUrl}
            placeholder="Enter API base URL"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.mutedText }]}>
            Gemini API URL:
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, backgroundColor: colors.background },
            ]}
            value={geminiApiUrl}
            onChangeText={setGeminiApiUrl}
            placeholder="Enter Gemini API URL"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <View style={styles.apiKeyHeader}>
            <Text style={[styles.label, { color: colors.mutedText }]}>
              Gemini API Key:
            </Text>
            <TouchableOpacity
              onPress={() => setShowApiKey(!showApiKey)}
              style={[
                styles.showHideButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={{ color: colors.primaryText }}>
                {showApiKey ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, backgroundColor: colors.background },
            ]}
            value={showApiKey ? geminiApiKey : getMaskedApiKey()}
            onChangeText={setGeminiApiKey}
            placeholder="Enter Gemini API key"
            placeholderTextColor={colors.mutedText}
            secureTextEntry={!showApiKey}
          />
        </View>

        <View
          style={[styles.switchContainer, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.label, { color: colors.mutedText }]}>
            Use Mock API:
          </Text>
          <Switch
            value={useMockApi}
            onValueChange={setUseMockApi}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSaveSettings}
          >
            <Text style={[styles.buttonText, { color: colors.primaryText }]}>
              Save Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.error }]}
            onPress={handleResetDefaults}
          >
            <Text style={[styles.buttonText, { color: colors.errorText }]}>
              Reset to Defaults
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Test Gemini API
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={testGeminiAPI}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>
            {isLoading ? "Testing..." : "Test Connection"}
          </Text>
        </TouchableOpacity>

        {testResult && (
          <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              Success!
            </Text>
            <Text style={[styles.resultText, { color: colors.text }]}>
              {testResult}
            </Text>
          </View>
        )}

        {error && (
          <View style={[styles.errorCard, { backgroundColor: colors.error }]}>
            <Text style={[styles.errorTitle, { color: colors.errorText }]}>
              Error
            </Text>
            <Text style={[styles.errorText, { color: colors.errorText }]}>
              {error}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  apiKeyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  showHideButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
  },
  errorCard: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
  },
});
