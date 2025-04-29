import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../lib/env";

export interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  received?: boolean;
  pending?: boolean;
  system?: boolean;
  roomId?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: {
    text: string;
    createdAt: Date;
    senderId: string;
  };
  unreadCount: number;
}

interface ChatContextType {
  messages: Message[];
  rooms: ChatRoom[];
  currentRoom: string | null;
  setCurrentRoom: (roomId: string | null) => void;
  sendMessage: (text: string) => void;
  markRoomAsRead: (roomId: string) => void;
  createRoom: (participants: string[], name?: string) => Promise<string>;
  loading: boolean;
  connected: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userDetails, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<typeof Socket | null>(null);

  // Kết nối WebSocket khi user đăng nhập
  useEffect(() => {
    if (isLoggedIn && userDetails) {
      connectSocket();
    } else if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isLoggedIn, userDetails]);

  // Lắng nghe các sự kiện khi có room mới được chọn
  useEffect(() => {
    if (currentRoom && socketRef.current) {
      setLoading(true);
      setMessages([]);

      // Join room
      socketRef.current.emit("join-room", { roomId: currentRoom });

      // Lấy tin nhắn cũ của room
      socketRef.current.emit(
        "fetch-messages",
        { roomId: currentRoom },
        (receivedMessages: Message[]) => {
          setMessages(
            receivedMessages.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            )
          );
          setLoading(false);
        }
      );

      // Đánh dấu đã đọc các tin nhắn trong room
      markRoomAsRead(currentRoom);
    }
  }, [currentRoom]);

  // Kết nối WebSocket
  const connectSocket = () => {
    if (!userDetails) return;

    const socket = io(API_BASE_URL, {
      query: {
        userId: userDetails.id,
      },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      setConnected(true);

      // Lấy danh sách rooms
      socket.emit("fetch-rooms", (receivedRooms: ChatRoom[]) => {
        setRooms(receivedRooms);
        setLoading(false);
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setConnected(false);
    });

    socket.on("new-message", (message: Message) => {
      if (message.roomId === currentRoom) {
        setMessages((prev) => [message, ...prev]);

        // Đánh dấu tin nhắn mới đã được đọc nếu đang ở trong room đó
        socket.emit("mark-read", { roomId: message.roomId });
      }

      // Cập nhật thông tin room
      setRooms((prev) =>
        prev.map((room) => {
          if (room.id === message.roomId) {
            return {
              ...room,
              lastMessage: {
                text: message.text,
                createdAt: message.createdAt,
                senderId: message.user._id,
              },
              unreadCount:
                currentRoom === message.roomId ? 0 : room.unreadCount + 1,
            };
          }
          return room;
        })
      );
    });

    socket.on("room-updated", (updatedRoom: ChatRoom) => {
      setRooms((prev) =>
        prev.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
      );
    });

    socket.on("new-room", (newRoom: ChatRoom) => {
      setRooms((prev) => [...prev, newRoom]);
    });
  };

  // Gửi tin nhắn mới
  const sendMessage = (text: string) => {
    if (!socketRef.current || !currentRoom || !userDetails) return;

    // Tạo message tạm thời để hiển thị ngay lập tức
    const tempId = Date.now().toString();
    const tempMessage: Message = {
      _id: tempId,
      text,
      createdAt: new Date(),
      user: {
        _id: userDetails.id,
        name: userDetails.username,
        avatar: userDetails.picture || undefined,
      },
      pending: true,
      roomId: currentRoom,
    };

    // Thêm tin nhắn tạm vào danh sách tin nhắn
    setMessages((prev) => [tempMessage, ...prev]);

    // Gửi tin nhắn qua WebSocket
    socketRef.current.emit(
      "send-message",
      {
        text,
        roomId: currentRoom,
      },
      (sentMessage: Message) => {
        // Cập nhật lại danh sách tin nhắn với tin nhắn đã được server xác nhận
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempId ? { ...sentMessage, received: true } : msg
          )
        );

        // Cập nhật thông tin room
        setRooms((prev) =>
          prev.map((room) => {
            if (room.id === currentRoom) {
              return {
                ...room,
                lastMessage: {
                  text,
                  createdAt: new Date(),
                  senderId: userDetails.id,
                },
              };
            }
            return room;
          })
        );
      }
    );
  };

  // Đánh dấu tin nhắn trong room đã đọc
  const markRoomAsRead = (roomId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit("mark-read", { roomId });

    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          return { ...room, unreadCount: 0 };
        }
        return room;
      })
    );
  };

  // Tạo room mới
  const createRoom = (
    participants: string[],
    name?: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !userDetails) {
        reject("Not connected to WebSocket");
        return;
      }

      socketRef.current.emit(
        "create-room",
        {
          participants: [...participants, userDetails.id],
          name: name || "",
        },
        (response: { roomId: string; error?: string }) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.roomId);
          }
        }
      );
    });
  };

  const value = {
    messages,
    rooms,
    currentRoom,
    setCurrentRoom,
    sendMessage,
    markRoomAsRead,
    createRoom,
    loading,
    connected,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
