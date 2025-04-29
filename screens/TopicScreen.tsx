import { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getPosts } from "../lib/apiService";
import PostItem from "../components/PostItem";
import { useTheme } from "../contexts/ThemeContext";
import { useTopicContext } from "../contexts/TopicContext";
import { useAuth } from "../contexts/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { PostData } from "../types/PostData";
import { useRequireAuth } from "@/lib/authUtils";

// Define navigation types
type RootStackParamList = {
  PostDetail: { id: string };
  CreatePost: { topicId: string; topicName: string };
  Topic: { id: string; name: string };
};

type TopicScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TopicScreenRouteProp = RouteProp<RootStackParamList, "Topic">;

export default function TopicScreen() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<TopicScreenNavigationProp>();
  const route = useRoute<TopicScreenRouteProp>();
  const { colors } = useTheme();
  const { setTopicName } = useTopicContext();
  const { isLoggedIn } = useAuth();
  const requireAuth = useRequireAuth();

  const { id, name } = route.params;

  useEffect(() => {
    if (name) {
      setTopicName(name);
      navigation.setOptions({ title: name });
    }
  }, [name, navigation, setTopicName]);

  const fetchPosts = useCallback(
    async (page = 0, refresh = false) => {
      if (refresh) {
        setIsRefreshing(true);
      } else if (!refresh && page === 0) {
        setIsLoading(true);
      }
      try {
        const response = await getPosts(id, page);
        const newPosts = response.data;

        if (newPosts.length === 0) {
          setHasMoreData(false);
        }
        if (page === 0 || refresh) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(0);
    setHasMoreData(true);
    fetchPosts(0, true);
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isRefreshing && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPosts(nextPage);
    }
  }, [isLoading, isRefreshing, hasMoreData, currentPage, fetchPosts]);

  const handlePostPress = (post: PostData) => {
    navigation.navigate("PostDetail", { id: post.id });
  };

  const handleCreatePost = () => {
    if (requireAuth(isLoggedIn, "create posts")) {
      navigation.navigate("CreatePost", { topicId: id, topicName: name });
    }
  };

  const renderItem = ({ item }: { item: PostData }) => (
    <PostItem post={item} onPress={() => handlePostPress(item)} />
  );

  if (isLoading && posts.length === 0) {
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={handleCreatePost}
      >
        <Ionicons name="add" size={24} color={colors.primaryText} />
        <Text style={[styles.createButtonText, { color: colors.primaryText }]}>
          Create Post
        </Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading && posts.length > 0 ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={styles.footerLoader}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  footerLoader: {
    marginVertical: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  createButtonText: {
    marginLeft: 8,
    fontWeight: "600",
  },
});
