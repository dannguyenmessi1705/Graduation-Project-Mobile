import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { getUserDetails } from "../lib/api";
import { useTheme } from "../contexts/ThemeContext";
import type { UserDetails } from "../types/UserData";
import { useRequireAuth } from "../lib/authUtils";
import { useAuth } from "../contexts/AuthContext";

export default function UserProfileScreen() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const { colors } = useTheme();
  const { isLoggedIn } = useAuth();
  const requireAuth = useRequireAuth();

  // @ts-ignore - Route params typing
  const { userId } = route.params;

  useEffect(() => {
    if (!isLoggedIn) {
      requireAuth(isLoggedIn, "view user profiles");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getUserDetails(userId);
        setUserDetails(profile.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    header: {
      alignItems: "center",
      padding: 20,
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
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: colors.text }}>User not found</Text>
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
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userDetails.email}</Text>
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
        <Text style={styles.sectionTitle}>Location</Text>
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
          <Text style={styles.infoLabel}>Postal Code</Text>
          <Text style={styles.infoValue}>
            {userDetails.postalCode || "Not specified"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
