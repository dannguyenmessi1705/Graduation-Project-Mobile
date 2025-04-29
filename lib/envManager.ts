import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// Default values from app.config.js
const DEFAULT_VALUES = {
  GEMINI_API_KEY: Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY,
  API_GEMINI_URL: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_GEMINI_URL,
  API_BASE_URL: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL,
  USE_MOCK_API: Constants.expoConfig?.extra?.EXPO_PUBLIC_USE_MOCK_API,
};

// Keys for SecureStore
const ENV_KEYS = {
  GEMINI_API_KEY: "env_GEMINI_API_KEY",
  API_GEMINI_URL: "env_API_GEMINI_URL",
  API_BASE_URL: "env_API_BASE_URL",
  USE_MOCK_API: "env_USE_MOCK_API",
};

// Get environment variable from SecureStore or use default
export async function getEnvironmentVariable(
  key: keyof typeof ENV_KEYS
): Promise<string> {
  try {
    const value = await SecureStore.getItemAsync(ENV_KEYS[key]);
    return value !== null ? value : DEFAULT_VALUES[key];
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return DEFAULT_VALUES[key];
  }
}

// Set environment variable in SecureStore
export async function setEnvironmentVariable(
  key: keyof typeof ENV_KEYS,
  value: string
): Promise<void> {
  try {
    await SecureStore.setItemAsync(ENV_KEYS[key], value);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

// Reset all environment variables to default values
export async function resetEnvironmentVariables(): Promise<void> {
  try {
    for (const key of Object.keys(ENV_KEYS) as Array<keyof typeof ENV_KEYS>) {
      await SecureStore.deleteItemAsync(ENV_KEYS[key]);
    }
  } catch (error) {
    console.error("Error resetting environment variables:", error);
  }
}

// Get all environment variables as an object
export async function getAllEnvironmentVariables(): Promise<
  Record<string, string>
> {
  const result: Record<string, string> = {};

  for (const key of Object.keys(DEFAULT_VALUES) as Array<
    keyof typeof ENV_KEYS
  >) {
    result[key] = await getEnvironmentVariable(key);
  }

  return result;
}
