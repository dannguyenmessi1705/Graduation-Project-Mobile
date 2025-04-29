import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { createPost } from "../lib/apiService";
import CreatePostAIHelper from "../components/CreatePostAIHelper";

interface RouteParams {
  topicId?: string;
  topicName?: string;
}

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ uri: string; name: string; type: string }>
  >([]);
  const [showAIHelper, setShowAIHelper] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const { topicId, topicName } = route.params as RouteParams;

  useEffect(() => {
    navigation.setOptions({
      title: `Create Post${topicName ? ` in ${topicName}` : ""}`,
    });
  }, [navigation, topicName]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your post");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Error", "Please enter content for your post");
      return;
    }

    if (!topicId) {
      Alert.alert("Error", "Please select a topic for your post");
      return;
    }

    setIsLoading(true);

    try {
      await createPost(topicId, title, content, selectedFiles);
      Alert.alert("Success", "Post created successfully", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to upload images"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos", "videos"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileUri = asset.uri;
      const fileName = fileUri.split("/").pop() || "image.jpg";
      const fileType = "image/jpeg";

      setSelectedFiles([
        ...selectedFiles,
        { uri: fileUri, name: fileName, type: fileType },
      ]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleAIHelp = () => {
    setShowAIHelper(!showAIHelper);
  };

  const applyAISuggestion = (suggestion: string, type: "title" | "content") => {
    if (type === "title") {
      setTitle(suggestion);
    } else {
      setContent(suggestion);
    }
    setShowAIHelper(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Title</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter post title"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Content</Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={content}
            onChangeText={setContent}
            placeholder="Write your post content here..."
            placeholderTextColor={colors.secondaryText}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>

        {selectedFiles.length > 0 && (
          <View style={styles.filesContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Attached Files
            </Text>
            {selectedFiles.map((file, index) => (
              <View
                key={index}
                style={[styles.fileItem, { backgroundColor: colors.card }]}
              >
                <Text
                  style={{ color: colors.text }}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {file.name}
                </Text>
                <TouchableOpacity onPress={() => removeFile(index)}>
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.attachButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={pickImage}
          >
            <Ionicons name="image-outline" size={20} color={colors.primary} />
            <Text style={[styles.attachButtonText, { color: colors.primary }]}>
              Attach Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.aiButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={handleAIHelp}
          >
            <Ionicons name="bulb-outline" size={20} color="#10b981" />
            <Text style={[styles.aiButtonText, { color: "#10b981" }]}>
              AI Help
            </Text>
          </TouchableOpacity>
        </View>

        {showAIHelper && (
          <CreatePostAIHelper
            content={content}
            onSelectTitle={applyAISuggestion}
          />
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
            isLoading && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text
              style={[styles.submitButtonText, { color: colors.primaryText }]}
            >
              Create Post
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 150,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  filesContainer: {
    marginBottom: 16,
  },
  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  attachButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
  },
  attachButtonText: {
    marginLeft: 8,
    fontWeight: "500",
  },
  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginLeft: 8,
  },
  aiButtonText: {
    marginLeft: 8,
    fontWeight: "500",
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
