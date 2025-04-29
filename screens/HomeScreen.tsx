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
import { getTopics } from "../lib/apiService";
import TopicItem from "../components/TopicItem";
import { useTheme } from "../contexts/ThemeContext";
import type { TopicData } from "../types/TopicData";

// Define navigation types for HomeScreen
type RootStackParamList = {
  Topic: {
    id: string;
    name: string;
  };
  Login: undefined;
  // Add other screens as needed
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Topic"
>;

export default function HomeScreen() {
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();

  const fetchTopics = useCallback(async (page = 0, refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (!refresh && page === 0) {
      setIsLoading(true);
    }
    try {
      const response = await getTopics(page);
      const newTopics = response.data;

      if (newTopics.length === 0) {
        setHasMoreData(false);
      }

      if (page === 0 || refresh) {
        setTopics(newTopics);
      } else {
        setTopics((prevTopics) => [...prevTopics, ...newTopics]);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics(0);
  }, [fetchTopics]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(0);
    setHasMoreData(true);
    fetchTopics(0, true);
  }, [fetchTopics]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isRefreshing && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchTopics(nextPage);
    }
  }, [isLoading, isRefreshing, hasMoreData, currentPage, fetchTopics]);

  const handleTopicPress = (topic: TopicData) => {
    navigation.navigate("Topic", {
      id: topic.id,
      name: topic.name,
    });
  };

  const renderItem = ({ item }: { item: TopicData }) => (
    <TopicItem topic={item} onPress={() => handleTopicPress(item)} />
  );

  if (isLoading && topics.length === 0) {
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
        data={topics}
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
        ListEmptyComponent={
          isLoading && topics.length > 0 ? (
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
