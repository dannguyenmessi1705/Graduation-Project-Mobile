import { getEnvironmentVariable } from "./envManager";
import Constants from "expo-constants";

// Đọc giá trị từ app.config.js
const DEFAULT_GEMINI_API_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY;
const DEFAULT_API_GEMINI_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_GEMINI_URL;
const DEFAULT_API_BASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL;
const DEFAULT_USE_MOCK_API =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_USE_MOCK_API;
// Khởi tạo giá trị mặc định
let GEMINI_API_KEY = DEFAULT_GEMINI_API_KEY;
let API_GEMINI_URL = DEFAULT_API_GEMINI_URL;
let API_BASE_URL = DEFAULT_API_BASE_URL;
let USE_MOCK_API = DEFAULT_USE_MOCK_API;

// Hàm để khởi tạo và cập nhật biến môi trường
export async function initializeEnvironmentVariables() {
  try {
    // Đọc giá trị từ SecureStore (nếu đã được lưu trữ) hoặc dùng giá trị mặc định
    GEMINI_API_KEY = await getEnvironmentVariable("GEMINI_API_KEY");
    API_GEMINI_URL = await getEnvironmentVariable("API_GEMINI_URL");
    API_BASE_URL = await getEnvironmentVariable("API_BASE_URL");
    USE_MOCK_API = (await getEnvironmentVariable("USE_MOCK_API")) === "true";

    console.log("Môi trường đã được khởi tạo:", { API_BASE_URL, USE_MOCK_API });

    return {
      GEMINI_API_KEY,
      API_GEMINI_URL,
      API_BASE_URL,
      USE_MOCK_API,
    };
  } catch (error) {
    console.error("Lỗi khi khởi tạo biến môi trường:", error);
    return {
      GEMINI_API_KEY: DEFAULT_GEMINI_API_KEY,
      API_GEMINI_URL: DEFAULT_API_GEMINI_URL,
      API_BASE_URL: DEFAULT_API_BASE_URL,
      USE_MOCK_API: DEFAULT_USE_MOCK_API,
    };
  }
}

// Export các biến
export { GEMINI_API_KEY, API_GEMINI_URL, API_BASE_URL, USE_MOCK_API };
