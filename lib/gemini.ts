import Constants from "expo-constants";

import { GEMINI_API_KEY, API_GEMINI_URL } from "./env";

export async function generateAIResponse(input: string): Promise<string> {
  try {
    const response = await fetch(`${API_GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: input }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Failed to generate content");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generateTitleSuggestions(
  content: string
): Promise<string[]> {
  try {
    const prompt = `Generate 3 engaging title suggestions for a forum post with the following content. Return only the titles separated by '|' without any additional text or explanations:\n\n${content}`;

    const response = await generateAIResponse(prompt);
    return response.split("|").map((title) => title.trim());
  } catch (error) {
    console.error("Error generating title suggestions:", error);
    return [];
  }
}

export async function summarizeContent(content: string): Promise<string> {
  try {
    const prompt = `Summarize the following forum post content in 2-3 sentences:\n\n${content}`;

    return await generateAIResponse(prompt);
  } catch (error) {
    console.error("Error summarizing content:", error);
    return "";
  }
}
