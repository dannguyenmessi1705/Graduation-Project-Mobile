import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { generateTitleSuggestions } from "../lib/gemini";
import Ionicons from "react-native-vector-icons/Ionicons";

interface CreatePostAIHelperProps {
  content: string;
  onSelectTitle: (title: string, type: "title" | "content") => void;
}

export default function CreatePostAIHelper({
  content,
  onSelectTitle,
}: CreatePostAIHelperProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  const generateSuggestions = async () => {
    if (!content || content.length < 20) return;

    setIsLoading(true);
    try {
      const titles = await generateTitleSuggestions(content);
      setSuggestions(titles);
    } catch (error) {
      console.error("Error generating title suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (content.length < 20) {
    return null;
  }

  return (
    <View style={styles.container}>
      {suggestions.length === 0 ? (
        <TouchableOpacity
          style={[styles.generateButton, { backgroundColor: colors.secondary }]}
          onPress={generateSuggestions}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Ionicons
                name="bulb-outline"
                size={16}
                color={colors.secondaryText}
              />
              <Text
                style={[styles.generateText, { color: colors.secondaryText }]}
              >
                Generate title suggestions
              </Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
            Title Suggestions:
          </Text>
          {suggestions.map((title, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.suggestionItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => onSelectTitle(title, "title")}
            >
              <Text style={[styles.suggestionText, { color: colors.cardText }]}>
                {title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  generateText: {
    fontWeight: "500",
    marginLeft: 8,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  suggestionItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  suggestionText: {
    fontWeight: "500",
  },
});
