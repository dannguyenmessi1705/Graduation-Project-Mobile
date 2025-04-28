import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { createComment } from "../lib/api";
import Ionicons from "react-native-vector-icons/Ionicons";

interface CreateCommentFormProps {
  postId: string;
  replyToCommentId?: string;
  onSuccess: () => void;
}

export default function CreateCommentForm({
  postId,
  replyToCommentId,
  onSuccess,
}: CreateCommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment(postId, content, replyToCommentId);
      setContent("");
      onSuccess();
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Write a comment..."
        placeholderTextColor={colors.mutedText}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: colors.primary },
          (!content.trim() || isSubmitting) && { opacity: 0.5 },
        ]}
        onPress={handleSubmit}
        disabled={!content.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>
            Posting...
          </Text>
        ) : (
          <>
            <Ionicons name="send" size={16} color={colors.primaryText} />
            <Text style={[styles.buttonText, { color: colors.primaryText }]}>
              Post
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "600",
    marginLeft: 8,
  },
});
