import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "@/screens/HomeScreen";
import LatestScreen from "@/screens/LatestScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import TopicScreen from "@/screens/TopicScreen";
import PostDetailScreen from "@/screens/PostDetailScreen";
import EditProfileScreen from "@/screens/EditProfileScreen";
import UserProfileScreen from "@/screens/UserProfileScreen";
import AIChatScreen from "@/screens/AIChatScreen";
import ChatRoomsScreen from "@/screens/ChatRoomsScreen";
import ChatRoomScreen from "@/screens/ChatRoomScreen";
import NewChatScreen from "@/screens/NewChatScreen";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import ForgotPasswordScreen from "@/screens/ForgotPasswordScreen";
import CreatePostScreen from "@/screens/CreatePostScreen";
import DebugScreen from "@/screens/DebugScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Latest") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Chats") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          }

          return (
            <Ionicons name={iconName as string} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Latest" component={LatestScreen} />
      <Tab.Screen name="Chats" component={ChatRoomsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Topic" component={TopicScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ title: "AI Assistant" }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{ title: "Chat" }}
      />
      <Stack.Screen
        name="NewChat"
        component={NewChatScreen}
        options={{ title: "New Conversation" }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Reset Password" }}
      />
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
        options={{ title: "Debug Environment" }}
      />
    </Stack.Navigator>
  );
}
