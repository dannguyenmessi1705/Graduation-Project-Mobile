import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useChatContext } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import { getUserDetails } from "../lib/apiService";

interface User {
  id: string;
  username: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
}

// Define navigation types
type RootStackParamList = {
  ChatRoom: { roomId: string };
};

type NewChatScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenNavigationProp>();
  const { colors } = useTheme();
  const { createRoom } = useChatContext();
  const { userDetails: currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Tìm kiếm người dùng dựa trên từ khóa
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setSearching(true);

    try {
      // Giả lập API call tìm kiếm người dùng
      // Trong thực tế, cần thay thế bằng API thực để tìm kiếm người dùng
      setTimeout(() => {
        // Mock users data cho demo
        const mockUsers = [
          { id: "1", username: "john_doe", firstName: "John", lastName: "Doe" },
          {
            id: "2",
            username: "jane_smith",
            firstName: "Jane",
            lastName: "Smith",
          },
          {
            id: "3",
            username: "robert_johnson",
            firstName: "Robert",
            lastName: "Johnson",
          },
          {
            id: "4",
            username: "sarah_williams",
            firstName: "Sarah",
            lastName: "Williams",
          },
          {
            id: "5",
            username: "michael_brown",
            firstName: "Michael",
            lastName: "Brown",
          },
        ];

        const filteredUsers = mockUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(query.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(query.toLowerCase())
        );

        // Loại bỏ người dùng hiện tại khỏi kết quả tìm kiếm
        const filteredWithoutCurrentUser = filteredUsers.filter(
          (user) => user.id !== currentUser?.id
        );

        setUsers(filteredWithoutCurrentUser);
        setSearching(false);
      }, 500);
    } catch (error) {
      console.error("Error searching users:", error);
      Alert.alert("Error", "Failed to search for users");
      setSearching(false);
    }
  };

  // Xử lý thay đổi từ khóa tìm kiếm
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Chọn hoặc bỏ chọn người dùng
  const toggleSelectUser = (user: User) => {
    const isSelected = selectedUsers.some((u) => u.id === user.id);

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Tạo cuộc trò chuyện mới
  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert("Error", "Please select at least one user to chat with");
      return;
    }

    setLoading(true);

    try {
      let roomName = "";

      // Tạo tên phòng dựa trên người dùng được chọn
      if (selectedUsers.length === 1) {
        const user = selectedUsers[0];
        roomName =
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username;
      } else {
        roomName = selectedUsers
          .slice(0, 2)
          .map((user) => user.firstName || user.username)
          .join(", ");

        if (selectedUsers.length > 2) {
          roomName += ` +${selectedUsers.length - 2} others`;
        }
      }

      // Gọi API tạo phòng chat
      const roomId = await createRoom(
        selectedUsers.map((user) => user.id),
        roomName
      );

      // Điều hướng tới phòng chat vừa tạo
      navigation.navigate("ChatRoom", { roomId });
    } catch (error) {
      console.error("Error creating chat room:", error);
      Alert.alert("Error", "Failed to create chat room");
    } finally {
      setLoading(false);
    }
  };

  // Render từng item người dùng
  const renderUserItem = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.some((user) => user.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.userItem, { borderBottomColor: colors.border }]}
        onPress={() => toggleSelectUser(item)}
      >
        <View style={styles.userAvatar}>
          <Text style={{ color: colors.primaryText }}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: colors.text }]}>
            {item.firstName && item.lastName
              ? `${item.firstName} ${item.lastName}`
              : item.username}
          </Text>
          <Text style={[styles.handle, { color: colors.mutedText }]}>
            @{item.username}
          </Text>
        </View>

        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: isSelected ? colors.primary : "transparent",
              borderColor: isSelected ? colors.primary : colors.border,
            },
          ]}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={16} color={colors.primaryText} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.mutedText} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search users..."
          placeholderTextColor={colors.mutedText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searching && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      {selectedUsers.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={[styles.selectedTitle, { color: colors.text }]}>
            Selected ({selectedUsers.length}):
          </Text>
          <FlatList
            data={selectedUsers}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.selectedUser,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => toggleSelectUser(item)}
              >
                <Text
                  style={[
                    styles.selectedUserText,
                    { color: colors.primaryText },
                  ]}
                  numberOfLines={1}
                >
                  {item.firstName || item.username}
                </Text>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.primaryText}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={styles.list}
        />
      ) : searchQuery !== "" && !searching ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>
            No users found
          </Text>
        </View>
      ) : (
        !searching && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>
              Search for users to chat with
            </Text>
          </View>
        )
      )}

      {selectedUsers.length > 0 && (
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleCreateChat}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <>
              <Ionicons
                name="chatbubbles-outline"
                size={20}
                color={colors.primaryText}
              />
              <Text
                style={[styles.createButtonText, { color: colors.primaryText }]}
              >
                Start Chat
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    padding: 8,
  },
  selectedContainer: {
    padding: 12,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectedUser: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedUserText: {
    marginRight: 6,
    fontSize: 14,
    maxWidth: 120,
  },
  list: {
    paddingBottom: 80,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: "500",
  },
  handle: {
    fontSize: 14,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
  },
  createButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});
