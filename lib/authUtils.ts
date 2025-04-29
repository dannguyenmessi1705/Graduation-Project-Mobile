import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

/**
 * Utility function to check if user is authenticated and prompt for login if not
 * @param isLoggedIn Current authentication status
 * @param navigation Navigation object
 * @param actionName Name of the action requiring authentication (for the alert message)
 * @returns Boolean indicating if the user can proceed with the action
 */
export const requireAuth = (
  isLoggedIn: boolean,
  navigation: any,
  actionName = "this action"
): boolean => {
  if (isLoggedIn) {
    return true;
  }

  Alert.alert(
    "Authentication Required",
    `You need to be logged in to ${actionName}.`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Login",
        onPress: () => navigation.navigate("Login"),
      },
    ],
    { cancelable: true }
  );

  return false;
};

/**
 * Custom hook to use the requireAuth function with navigation already provided
 */
export const useRequireAuth = () => {
  const navigation = useNavigation();

  return (isLoggedIn: boolean, actionName = "this action") =>
    requireAuth(isLoggedIn, navigation, actionName);
};
