import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { formatDistanceToNow } from "date-fns";
import Markdown from "react-native-markdown-display";
import CreateCommentForm from "./CreateCommentForm";
import { deleteComment } from "../lib/api";
import type { CommentData } from "../types/PostData";
import { useRequireAuth } from "../lib/authUtils";
import { useNavigation } from "@react-navigation/native";

interface CommentItemProps {
  comment: CommentData;
  onCommentDeleted: (commentId: string) => void;
  onReplySuccess: () => void;
}

export default function CommentItem({
  comment,
  onCommentDeleted,
  onReplySuccess,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { colors } = useTheme();
  const { userDetails } = useAuth();

  const navigation = useNavigation();
  const requireAuth = useRequireAuth();

  const handleReply = () => {
    if (requireAuth(userDetails !== null, "reply to comments")) {
      setIsReplying(!isReplying);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      onCommentDeleted(comment.id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleReplySuccess = () => {
    setIsReplying(false);
    onReplySuccess();
  };

  const isAuthor = userDetails?.id === comment.author.id;

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.authorName, { color: colors.text }]}>
          {comment.author.username}
        </Text>
        <Text style={[styles.timestamp, { color: colors.mutedText }]}>
          {formatDistanceToNow(new Date(comment.createdAt))} ago
        </Text>
      </View>

      <View style={styles.content}>
        <Markdown
          style={{
            body: { color: colors.text },
            heading1: { color: colors.text },
            heading2: { color: colors.text },
            heading3: { color: colors.text },
            heading4: { color: colors.text },
            heading5: { color: colors.text },
            heading6: { color: colors.text },
            link: { color: colors.primary },
            blockquote: {
              backgroundColor: colors.muted,
              borderLeftColor: colors.primary,
            },
          }}
        >
          {comment.content}
        </Markdown>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleReply}>
          <Ionicons
            name="return-down-forward-outline"
            size={16}
            color={colors.mutedText}
          />
          <Text style={[styles.actionText, { color: colors.mutedText }]}>
            Reply
          </Text>
        </TouchableOpacity>

        {isAuthor && (
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isReplying && (
        <View style={styles.replyForm}>
          <CreateCommentForm
            postId={comment.postId}
            replyToCommentId={comment.id}
            onSuccess={handleReplySuccess}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderLeftWidth: 2,
    marginBottom: 12,
    marginLeft: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  authorName: {
    fontWeight: "500",
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  content: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
  },
  replyForm: {
    marginTop: 12,
  },
});
