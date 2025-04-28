import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { getUserDetails, updateUserProfile } from "../lib/api";
import Toast from "react-native-toast-message";

export default function EditProfileScreen() {
  const { userDetails: authUserDetails } = useAuth();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [picture, setPicture] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthDay: "",
    country: "",
    city: "",
    phoneNumber: "",
    postalCode: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (authUserDetails?.id) {
        setIsLoading(true);
        try {
          const details = await getUserDetails(authUserDetails.id);
          setFormData({
            firstName: details.data.firstName || "",
            lastName: details.data.lastName || "",
            email: details.data.email || "",
            gender: details.data.gender || "",
            birthDay: details.data.birthDay
              ? new Date(details.data.birthDay).toISOString().split("T")[0]
              : "",
            country: details.data.country || "",
            city: details.data.city || "",
            phoneNumber: details.data.phoneNumber || "",
            postalCode: details.data.postalCode || "",
          });
          setPicture(details.data.picture || null);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to load user details. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [authUserDetails]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2:
          "We need camera roll permissions to change your profile picture.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    if (picture && !picture.startsWith("http")) {
      const uriParts = picture.split(".");
      const fileType = uriParts[uriParts.length - 1];

      submitData.append("picture", {
        uri: picture,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      await updateUserProfile(submitData);
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been successfully updated.",
      });
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update profile:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
    avatarContainer: {
      position: "relative",
      marginBottom: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    avatarFallback: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.muted,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: 40,
      fontWeight: "bold",
      color: colors.text,
    },
    changePhotoButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    form: {
      padding: 20,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    buttonContainer: {
      marginTop: 20,
    },
    saveButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    saveButtonText: {
      color: colors.primaryText,
      fontSize: 16,
      fontWeight: "600",
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {picture ? (
            <Image
              source={{
                uri: picture.startsWith("http")
                  ? decodeURIComponent(picture)
                  : picture,
              }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>
                {authUserDetails?.username?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={pickImage}
          >
            <Ionicons name="camera" size={20} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => handleInputChange("firstName", text)}
            placeholder="Enter first name"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => handleInputChange("lastName", text)}
            placeholder="Enter last name"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            placeholder="Enter email"
            placeholderTextColor={colors.mutedText}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={formData.gender}
            onChangeText={(text) => handleInputChange("gender", text)}
            placeholder="Enter gender"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Birthday</Text>
          <TextInput
            style={styles.input}
            value={formData.birthDay}
            onChangeText={(text) => handleInputChange("birthDay", text)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={formData.country}
            onChangeText={(text) => handleInputChange("country", text)}
            placeholder="Enter country"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(text) => handleInputChange("city", text)}
            placeholder="Enter city"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange("phoneNumber", text)}
            placeholder="Enter phone number"
            placeholderTextColor={colors.mutedText}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            style={styles.input}
            value={formData.postalCode}
            onChangeText={(text) => handleInputChange("postalCode", text)}
            placeholder="Enter postal code"
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.primaryText} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
