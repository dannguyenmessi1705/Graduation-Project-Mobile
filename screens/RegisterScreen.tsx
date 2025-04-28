import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [picture, setPicture] = useState<string | null>(null);
  const navigation = useNavigation();
  const { register } = useAuth();
  const { colors } = useTheme();

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
    username: "",
    password: "",
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "We need camera roll permissions to select a profile picture.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos", "livePhotos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.username || !formData.email || !formData.password) {
        Toast.show({
          type: "error",
          text1: "Missing Information",
          text2: "Please fill in all required fields.",
        });
        return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleRegister = async () => {
    setIsLoading(true);

    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    if (picture) {
      const uriParts = picture.split(".");
      const fileType = uriParts[uriParts.length - 1];

      submitData.append("picture", {
        uri: picture,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const response = await fetch(
        "http://api.forum.didan.id.vn/forum/users/register",
        {
          method: "POST",
          body: submitData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Registration successful",
          text2: "You have been successfully registered.",
        });

        // If the API returns a token, use it to log in
        if (data.data && data.data.access_token) {
          await register(data.data.access_token);
        } else {
          navigation.navigate("Login" as never);
        }
      } else {
        throw new Error(data.status.message || "Registration failed");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2:
          error instanceof Error
            ? error.message
            : "An error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(text) => handleInputChange("username", text)}
                placeholder="Enter username"
                placeholderTextColor={colors.mutedText}
                autoCapitalize="none"
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
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                placeholder="Enter password"
                placeholderTextColor={colors.mutedText}
                secureTextEntry
              />
            </View>
          </>
        );
      case 2:
        return (
          <>
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
          </>
        );
      case 3:
        return (
          <>
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
            <View style={styles.formGroup}>
              <Text style={styles.label}>Profile Picture</Text>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                <Ionicons
                  name="image-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.imagePickerText}>
                  {picture ? "Change Picture" : "Select Picture"}
                </Text>
              </TouchableOpacity>
              {picture && (
                <Text style={styles.imageSelectedText}>Image selected</Text>
              )}
            </View>
          </>
        );
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: 20,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.mutedText,
    },
    stepIndicator: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 24,
    },
    step: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.muted,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
    },
    stepActive: {
      backgroundColor: colors.primary,
    },
    stepText: {
      color: colors.mutedText,
      fontWeight: "bold",
    },
    stepTextActive: {
      color: colors.primaryText,
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
    imagePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
    },
    imagePickerText: {
      marginLeft: 8,
      fontSize: 16,
      color: colors.primary,
    },
    imageSelectedText: {
      marginTop: 8,
      fontSize: 14,
      color: colors.primary,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 24,
    },
    button: {
      flex: 1,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonOutline: {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: "transparent",
    },
    buttonPrimary: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    buttonTextOutline: {
      color: colors.primary,
    },
    buttonTextPrimary: {
      color: colors.primaryText,
    },
    loginLink: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 24,
    },
    loginText: {
      color: colors.text,
      fontSize: 14,
    },
    loginLinkText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 5,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Step {step} of 3</Text>
          </View>

          <View style={styles.stepIndicator}>
            <View style={[styles.step, step >= 1 && styles.stepActive]}>
              <Text
                style={[styles.stepText, step >= 1 && styles.stepTextActive]}
              >
                1
              </Text>
            </View>
            <View style={[styles.step, step >= 2 && styles.stepActive]}>
              <Text
                style={[styles.stepText, step >= 2 && styles.stepTextActive]}
              >
                2
              </Text>
            </View>
            <View style={[styles.step, step >= 3 && styles.stepActive]}>
              <Text
                style={[styles.stepText, step >= 3 && styles.stepTextActive]}
              >
                3
              </Text>
            </View>
          </View>

          {renderStep()}

          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.buttonOutline,
                  { marginRight: 8 },
                ]}
                onPress={prevStep}
              >
                <Text style={[styles.buttonText, styles.buttonTextOutline]}>
                  Previous
                </Text>
              </TouchableOpacity>
            )}

            {step < 3 ? (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.buttonPrimary,
                  step > 1 ? { marginLeft: 8 } : {},
                ]}
                onPress={nextStep}
              >
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
                  Next
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, { marginLeft: 8 }]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.primaryText} />
                ) : (
                  <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
                    Register
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login" as never)}
            >
              <Text style={styles.loginLinkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
