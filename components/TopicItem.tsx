import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { TopicData } from "../types/TopicData";

interface TopicItemProps {
  topic: TopicData;
  onPress: () => void;
}

export default function TopicItem({ topic, onPress }: TopicItemProps) {
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
          {topic.name}
        </Text>
        <Text
          style={[styles.description, { color: colors.mutedText }]}
          numberOfLines={2}
        >
          {topic.description}
        </Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons
              name="document-text-outline"
              size={16}
              color={colors.mutedText}
            />
            <Text style={[styles.statText, { color: colors.mutedText }]}>
              {topic.totalPosts} posts
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color={colors.mutedText}
            />
            <Text style={[styles.statText, { color: colors.mutedText }]}>
              {topic.totalComments} comments
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
  description: {
    fontSize: 14,
    marginBottom: 8,
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
