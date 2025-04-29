import { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getLatestPosts } from "../lib/api";
import PostItem from "../components/PostItem";
import { useTheme } from "../contexts/ThemeContext";
import type { PostData } from "../types/PostData";

// Define navigation types for LatestScreen
type RootStackParamList = {
  PostDetail: {
    id: string;
  };
  Login: undefined;
  // Add other screens as needed
};

type LatestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostDetail"
>;

export default function LatestScreen() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<LatestScreenNavigationProp>();
  const { colors } = useTheme();

  const fetchLatestPosts = useCallback(async (page = 0, refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (!refresh && page === 0) {
      setIsLoading(true);
    }
    try {
      const response = await getLatestPosts(page);
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
      console.error("Failed to fetch latest posts:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestPosts(0);
  }, [fetchLatestPosts]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(0);
    setHasMoreData(true);
    fetchLatestPosts(0, true);
  }, [fetchLatestPosts]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isRefreshing && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchLatestPosts(nextPage);
    }
  }, [isLoading, isRefreshing, hasMoreData, currentPage, fetchLatestPosts]);

  const handlePostPress = (post: PostData) => {
    navigation.navigate("PostDetail", { id: post.id });
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
});
