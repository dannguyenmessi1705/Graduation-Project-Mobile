import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getTopics } from "../lib/api";
import TopicItem from "../components/TopicItem";
import { useTheme } from "../contexts/ThemeContext";
import type { TopicData } from "../types/TopicData";

// Define navigation types for HomeScreen
type RootStackParamList = {
  Topic: {
    id: string;
    name: string;
  };
  // Add other screens as needed
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Topic"
>;

export default function HomeScreen() {
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();

  useEffect(() => {
    fetchTopics();
  }, [currentPage]);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await getTopics(currentPage);
      setTopics(response.data);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        onRefresh={fetchTopics}
        refreshing={isLoading}
        onEndReached={() => {
          if (!isLoading) {
            setCurrentPage((prev) => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
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
});
