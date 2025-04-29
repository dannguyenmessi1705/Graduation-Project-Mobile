import {
  GEMINI_API_KEY,
  API_GEMINI_URL,
  API_BASE_URL,
  USE_MOCK_API,
} from "./env";

// This function logs environment variables to the console
// Only use this during development!
export function logEnvironmentVariables() {
  console.log("Environment Variables:");
  console.log(`API_BASE_URL: ${API_BASE_URL}`);
  console.log(`USE_MOCK_API: ${USE_MOCK_API}`);
  console.log(`API_GEMINI_URL: ${API_GEMINI_URL}`);

  // For security, only log if the API key exists, not its actual value
  console.log(`GEMINI_API_KEY exists: ${Boolean(GEMINI_API_KEY)}`);
}

// This function returns a masked version of the API key for debugging
// Only the first and last 4 characters are shown
export function getMaskedApiKey() {
  if (!GEMINI_API_KEY) return "Not set";
  if (GEMINI_API_KEY.length <= 8) return "***"; // Too short to mask properly

  const firstFour = GEMINI_API_KEY.substring(0, 4);
  const lastFour = GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 4);
  return `${firstFour}...${lastFour}`;
}
