import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useChatContext } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import { requireAuth } from "../lib/authUtils";

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  ChatRoom: { roomId: string };
  NewChat: undefined;
};

type ChatRoomsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function ChatRoomsScreen() {
  const navigation = useNavigation<ChatRoomsScreenNavigationProp>();
  const { colors } = useTheme();
  const { rooms, loading, connected } = useChatContext();
  const { isLoggedIn } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Kiểm tra xác thực khi vào màn hình
  useFocusEffect(
    React.useCallback(() => {
      if (!isLoggedIn) {
        Alert.alert(
          "Authentication Required",
          "You need to be logged in to use chat features.",
          [
            {
              text: "Cancel",
              onPress: () => navigation.goBack(),
              style: "cancel",
            },
            {
              text: "Login",
              onPress: () => navigation.navigate("Login"),
            },
          ],
          { cancelable: false }
        );
      }
    }, [isLoggedIn, navigation])
  );

  // Cập nhật header với nút tạo chat mới
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleNewChat} style={{ marginRight: 16 }}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const handleNewChat = () => {
    if (!requireAuth(isLoggedIn, navigation, "start a new conversation"))
      return;
    navigation.navigate("NewChat");
  };

  const handleSelectRoom = (roomId: string) => {
    navigation.navigate("ChatRoom", { roomId });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Thời gian delay giả lập để refresh room list
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);

    // Nếu là cùng ngày, hiển thị giờ
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Nếu cùng năm, hiển thị tháng và ngày
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }

    // Nếu khác năm, hiển thị đầy đủ
    return messageDate.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !refreshing) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!connected && !loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Ionicons name="wifi-outline" size={50} color={colors.mutedText} />
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Connection lost
        </Text>
        <Text style={[styles.emptySubText, { color: colors.mutedText }]}>
          Pull down to reconnect
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRefresh}
        >
          <Text style={{ color: colors.primaryText }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {rooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="chatbubbles-outline"
            size={50}
            color={colors.mutedText}
          />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No conversations yet
          </Text>
          <Text style={[styles.emptySubText, { color: colors.mutedText }]}>
            Start chatting by tapping the button above
          </Text>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={handleNewChat}
          >
            <Text style={{ color: colors.primaryText }}>
              Start a new conversation
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.roomItem, { borderBottomColor: colors.border }]}
              onPress={() => handleSelectRoom(item.id)}
            >
              <View style={styles.roomAvatar}>
                <Text
                  style={[styles.roomAvatarText, { color: colors.primaryText }]}
                >
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.roomInfo}>
                <View style={styles.roomHeader}>
                  <Text
                    style={[
                      styles.roomName,
                      {
                        color: colors.text,
                        fontWeight: item.unreadCount > 0 ? "700" : "400",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {item.lastMessage && (
                    <Text
                      style={[styles.timeText, { color: colors.mutedText }]}
                    >
                      {formatTime(item.lastMessage.createdAt)}
                    </Text>
                  )}
                </View>
                <View style={styles.messageRow}>
                  {item.lastMessage ? (
                    <Text
                      style={[
                        styles.lastMessageText,
                        {
                          color:
                            item.unreadCount > 0
                              ? colors.text
                              : colors.mutedText,
                          fontWeight: item.unreadCount > 0 ? "700" : "400",
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.lastMessage.text}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.noMessageText,
                        { color: colors.mutedText },
                      ]}
                    >
                      No messages yet
                    </Text>
                  )}

                  {item.unreadCount > 0 && (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: colors.primaryText },
                        ]}
                      >
                        {item.unreadCount > 99 ? "99+" : item.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  startButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
  },
  roomItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  roomAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  roomAvatarText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  roomInfo: {
    flex: 1,
    marginLeft: 16,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  roomName: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessageText: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  noMessageText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
