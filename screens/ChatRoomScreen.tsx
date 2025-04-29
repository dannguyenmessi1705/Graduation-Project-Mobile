import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useChatContext, Message } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";

type ChatRoomScreenRouteProp = RouteProp<
  { ChatRoom: { roomId: string } },
  "ChatRoom"
>;

export default function ChatRoomScreen() {
  const route = useRoute<ChatRoomScreenRouteProp>();
  const { roomId } = route.params;
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { messages, setCurrentRoom, currentRoom, sendMessage, loading, rooms } =
    useChatContext();
  const { userDetails } = useAuth();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Thiết lập room hiện tại khi vào màn hình
  useEffect(() => {
    setCurrentRoom(roomId);

    // Cập nhật tiêu đề header
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      navigation.setOptions({
        title: room.name,
      });
    }

    return () => {
      // Xóa room hiện tại khi rời màn hình
      setCurrentRoom(null);
    };
  }, [roomId, rooms]);

  const onSend = (messages: Message[] = []) => {
    if (messages.length > 0) {
      sendMessage(messages[0].text);
    }
  };

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.primary,
          },
          left: {
            backgroundColor: colors.card,
          },
        }}
        textStyle={{
          right: {
            color: colors.primaryText,
          },
          left: {
            color: colors.text,
          },
        }}
        timeTextStyle={{
          right: {
            color: `${colors.primaryText}CC`,
          },
          left: {
            color: colors.mutedText,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        }}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        containerStyle={{
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
          marginBottom: 5,
        }}
      >
        <View style={[styles.sendButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="send" size={20} color={colors.primaryText} />
        </View>
      </Send>
    );
  };

  const renderLoading = () => {
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
  };

  const renderFooter = () => {
    if (typingUsers.length > 0) {
      return (
        <View
          style={[
            styles.footerContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.footerText, { color: colors.mutedText }]}>
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
            typing...
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: userDetails?.id || "",
            name: userDetails?.username || "",
            avatar: userDetails?.picture || undefined,
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          renderLoading={renderLoading}
          renderFooter={renderFooter}
          placeholder="Type a message..."
          alwaysShowSend
          showUserAvatar
          scrollToBottomComponent={() => (
            <Ionicons name="chevron-down" size={20} color={colors.primary} />
          )}
          inverted={true}
          renderAvatarOnTop
          renderUsernameOnMessage
          isLoadingEarlier={loading}
          keyboardShouldPersistTaps="handled"
          timeFormat="HH:mm"
          dateFormat="MMMM D, YYYY"
          loadEarlier={messages.length >= 20}
          isTyping={typingUsers.length > 0}
        />
      </KeyboardAvoidingView>
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
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
  footerContainer: {
    padding: 5,
    paddingLeft: 16,
  },
  footerText: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
