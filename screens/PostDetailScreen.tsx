import { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  getPostDetail,
  getPostComments,
  votePost,
  revokeVote,
} from "../lib/api";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import Markdown from "react-native-markdown-display";
import Ionicons from "react-native-vector-icons/Ionicons";
import { formatDistanceToNow } from "date-fns";
import CommentItem from "../components/CommentItem";
import CreateCommentForm from "../components/CreateCommentForm";
import type { PostDetailData, CommentData } from "../types/PostData";

export default function PostDetailScreen() {
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const route = useRoute();
  const { colors } = useTheme();
  const { isLoggedIn, handleExpiredToken } = useAuth();

  const { id } = route.params as { id: string };

  const fetchPostData = useCallback(
    async (refresh = false) => {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      try {
        const [postData, commentsData] = await Promise.all([
          getPostDetail(id),
          getPostComments(id),
        ]);
        setPost(postData.data);
        setComments(commentsData.data || []);
      } catch (error) {
        console.error("Failed to fetch post data:", error);
        if (error instanceof Error && error.message === "TokenExpiredError") {
          handleExpiredToken();
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id, handleExpiredToken]
  );
  // Initial data load
  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const handleRefresh = useCallback(() => {
    fetchPostData(true);
  }, [fetchPostData]);

  const handleVote = async (voteType: "up" | "down") => {
    if (!post || !isLoggedIn) return;

    try {
      if (userVote === voteType) {
        await revokeVote("post", post.id);
        setPost((prevPost) => {
          if (!prevPost) return null;
          return {
            ...prevPost,
            totalUpvotes:
              voteType === "up"
                ? prevPost.totalUpvotes - 1
                : prevPost.totalUpvotes,
            totalDownvotes:
              voteType === "down"
                ? prevPost.totalDownvotes - 1
                : prevPost.totalDownvotes,
          };
        });
        setUserVote(null);
      } else {
        await votePost(post.id, voteType);
        setPost((prevPost) => {
          if (!prevPost) return null;
          return {
            ...prevPost,
            totalUpvotes:
              voteType === "up"
                ? prevPost.totalUpvotes + 1
                : prevPost.totalUpvotes,
            totalDownvotes:
              voteType === "down"
                ? prevPost.totalDownvotes + 1
                : prevPost.totalDownvotes,
          };
        });
        setUserVote(voteType);
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleCommentPosted = async () => {
    try {
      const commentsData = await getPostComments(id);
      setComments(commentsData.data || []);
      if (post) {
        setPost({
          ...post,
          totalComments: post.totalComments + 1,
        });
      }
    } catch (error) {
      console.error("Failed to refresh comments:", error);
    }
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((c) => c.id !== commentId)
    );
    if (post) {
      setPost({
        ...post,
        totalComments: post.totalComments - 1,
      });
    }
  };

  if (isLoading && !post) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Post not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <View style={[styles.postCard, { backgroundColor: colors.card }]}>
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

        <View style={styles.contentWrapper}>
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
            }}
          >
            {post.content}
          </Markdown>
        </View>

        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleVote("up")}
          >
            <Ionicons
              name={userVote === "up" ? "thumbs-up" : "thumbs-up-outline"}
              size={20}
              color={userVote === "up" ? colors.primary : colors.mutedText}
            />
            <Text
              style={[
                styles.actionText,
                {
                  color: userVote === "up" ? colors.primary : colors.mutedText,
                },
              ]}
            >
              {post.totalUpvotes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleVote("down")}
          >
            <Ionicons
              name={userVote === "down" ? "thumbs-down" : "thumbs-down-outline"}
              size={20}
              color={userVote === "down" ? colors.primary : colors.mutedText}
            />
            <Text
              style={[
                styles.actionText,
                {
                  color:
                    userVote === "down" ? colors.primary : colors.mutedText,
                },
              ]}
            >
              {post.totalDownvotes}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionButton}>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={colors.mutedText}
            />
            <Text style={[styles.actionText, { color: colors.mutedText }]}>
              {post.totalComments}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.commentsSection}>
        <Text style={[styles.commentsHeader, { color: colors.text }]}>
          Comments ({post.totalComments})
        </Text>

        {isLoggedIn && (
          <CreateCommentForm postId={post.id} onSuccess={handleCommentPosted} />
        )}

        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onCommentDeleted={handleCommentDeleted}
            onReplySuccess={handleCommentPosted}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  postCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorName: {
    fontWeight: "500",
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  contentWrapper: {
    marginBottom: 16,
  },
  actionsBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});
