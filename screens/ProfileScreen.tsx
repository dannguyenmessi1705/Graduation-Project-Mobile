import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function ProfileScreen() {
  const { userDetails, logout } = useAuth();
  const navigation = useNavigation();
  const { colors, theme, setTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile" as never);
  };

  const handleThemeChange = () => {
    Alert.alert(
      "Change Theme",
      "Select a theme",
      [
        {
          text: "Light",
          onPress: () => setTheme("light"),
        },
        {
          text: "Dark",
          onPress: () => setTheme("dark"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      padding: 20,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    avatarFallback: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.muted,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 40,
      fontWeight: "bold",
      color: colors.text,
    },
    username: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    email: {
      fontSize: 16,
      color: colors.mutedText,
      marginBottom: 16,
    },
    editButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    editButtonText: {
      color: colors.primaryText,
      fontWeight: "600",
    },
    section: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      marginBottom: 12,
      alignItems: "center",
    },
    infoLabel: {
      width: 120,
      fontSize: 16,
      color: colors.mutedText,
    },
    infoValue: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuIcon: {
      marginRight: 16,
    },
    menuText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    logoutButton: {
      marginTop: 20,
      backgroundColor: colors.error,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    logoutText: {
      color: colors.errorText,
      fontSize: 16,
      fontWeight: "600",
    },
  });

  if (!userDetails) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: colors.text }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {userDetails.picture ? (
          <Image
            source={{ uri: decodeURIComponent(userDetails.picture) }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>
              {userDetails.username[0].toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.username}>{userDetails.username}</Text>
        <Text style={styles.email}>{userDetails.email}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>
            {userDetails.firstName} {userDetails.lastName}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>
            {userDetails.gender || "Not specified"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Birthday</Text>
          <Text style={styles.infoValue}>
            {userDetails.birthDay
              ? new Date(userDetails.birthDay).toLocaleDateString()
              : "Not specified"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Country</Text>
          <Text style={styles.infoValue}>
            {userDetails.country || "Not specified"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>City</Text>
          <Text style={styles.infoValue}>
            {userDetails.city || "Not specified"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>
            {userDetails.phoneNumber || "Not specified"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Postal Code</Text>
          <Text style={styles.infoValue}>
            {userDetails.postalCode || "Not specified"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handleThemeChange}>
          <Ionicons
            name="color-palette-outline"
            size={24}
            color={colors.primary}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Theme</Text>
          <Text style={{ color: colors.mutedText }}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("AIChat" as never)}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color={colors.primary}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>AI Assistant</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            alert("Change password functionality would be implemented here")
          }
        >
          <Ionicons
            name="key-outline"
            size={24}
            color={colors.primary}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            alert("Notification settings would be implemented here")
          }
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.primary}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
