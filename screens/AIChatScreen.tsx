import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { generateAIResponse } from "../lib/gemini";
import Ionicons from "react-native-vector-icons/Ionicons";
import Markdown from "react-native-markdown-display";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function AIChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateAIResponse(input.trim());

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={48}
              color={colors.mutedText}
            />
            <Text style={[styles.emptyStateText, { color: colors.mutedText }]}>
              Ask me anything about the forum or get help with your posts!
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.isUser
                  ? [styles.userBubble, { backgroundColor: colors.primary }]
                  : [styles.aiBubble, { backgroundColor: colors.card }],
              ]}
            >
              {message.isUser ? (
                <Text
                  style={[styles.messageText, { color: colors.primaryText }]}
                >
                  {message.text}
                </Text>
              ) : (
                <Markdown
                  style={{
                    body: { color: colors.cardText },
                    heading1: { color: colors.cardText },
                    heading2: { color: colors.cardText },
                    heading3: { color: colors.cardText },
                    heading4: { color: colors.cardText },
                    heading5: { color: colors.cardText },
                    heading6: { color: colors.cardText },
                    link: { color: colors.primary },
                    blockquote: {
                      backgroundColor: colors.muted,
                      borderLeftColor: colors.primary,
                    },
                    code_block: {
                      backgroundColor: colors.muted,
                      color: colors.cardText,
                    },
                    code_inline: {
                      backgroundColor: colors.muted,
                      color: colors.cardText,
                    },
                  }}
                >
                  {message.text}
                </Markdown>
              )}
            </View>
          ))
        )}
        {isLoading && (
          <View
            style={[
              styles.messageBubble,
              styles.aiBubble,
              { backgroundColor: colors.card },
            ]}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.background, color: colors.text },
          ]}
          placeholder="Type your message..."
          placeholderTextColor={colors.mutedText}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSend}
          disabled={isLoading || !input.trim()}
        >
          <Ionicons name="send" size={20} color={colors.primaryText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyStateText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
  },
  aiBubble: {
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
