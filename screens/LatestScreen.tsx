import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
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
  // Add other screens as needed
};

type LatestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostDetail"
>;

export default function LatestScreen() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<LatestScreenNavigationProp>();
  const { colors } = useTheme();

  useEffect(() => {
    fetchLatestPosts();
  }, [currentPage]);

  const fetchLatestPosts = async () => {
    setIsLoading(true);
    try {
      const response = await getLatestPosts(currentPage);
      setPosts((prevPosts) =>
        currentPage === 0 ? response.data : [...prevPosts, ...response.data]
      );
    } catch (error) {
      console.error("Failed to fetch latest posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        onRefresh={fetchLatestPosts}
        refreshing={isLoading}
        onEndReached={() => {
          if (!isLoading) {
            setCurrentPage((prev) => prev + 1);
          }
        }}
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
