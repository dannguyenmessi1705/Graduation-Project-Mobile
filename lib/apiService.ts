import * as realApi from "./api";
import * as mockApi from "./mockApi";

// Set this to false to use the real API, or true to use the mock API
const USE_MOCK_API = true;

// Export all functions from either the real API or mock API based on the flag
export const api = USE_MOCK_API ? mockApi : realApi;

// You can also export individual functions if needed
export const {
  getUserInfo,
  getTopics,
  getPosts,
  getLatestPosts,
  getPostDetail,
  getPostComments,
  getUserDetails,
  updateUserProfile,
  createPost,
  createComment,
  votePost,
  revokeVote,
  deletePost,
  deleteComment,
  updatePost,
  getUnreadNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getCommentDetails,
} = USE_MOCK_API ? mockApi : realApi;
