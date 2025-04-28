import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { formatDistanceToNow } from "date-fns";
import type { PostData } from "../types/PostData";

interface PostItemProps {
  post: PostData;
  onPress: () => void;
}

export default function PostItem({ post, onPress }: PostItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.cardText }]}>
          {post.title}
        </Text>

        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: colors.cardText }]}>
            {post.author.username}
          </Text>
          <Text style={[styles.timestamp, { color: colors.mutedText }]}>
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons
              name="thumbs-up-outline"
              size={16}
              color={colors.mutedText}
            />
            <Text style={[styles.statText, { color: colors.mutedText }]}>
              {post.totalUpvotes}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="thumbs-down-outline"
              size={16}
              color={colors.mutedText}
            />
            <Text style={[styles.statText, { color: colors.mutedText }]}>
              {post.totalDownvotes}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color={colors.mutedText}
            />
            <Text style={[styles.statText, { color: colors.mutedText }]}>
              {post.totalComments}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  authorInfo: {
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
  stats: {
    flexDirection: "row",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
