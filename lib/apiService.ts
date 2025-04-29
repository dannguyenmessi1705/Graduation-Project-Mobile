import * as realApi from "./api";
import * as mockApi from "./mockApi";
import { USE_MOCK_API } from "./env";

// Tạo proxy để tự động chọn API thích hợp dựa trên biến môi trường hiện tại
const apiProxy = new Proxy({} as typeof realApi, {
  get: (target, prop: string) => {
    // Mỗi khi một phương thức được gọi, kiểm tra giá trị hiện tại của USE_MOCK_API
    // và chọn API thích hợp
    const api = USE_MOCK_API ? mockApi : realApi;
    return api[prop as keyof typeof realApi];
  },
});

// Export các hàm API qua proxy để có thể thay đổi động sử dụng rest parameters
export const getUserInfo = (...args: Parameters<typeof realApi.getUserInfo>) =>
  apiProxy.getUserInfo(...args);

export const getTopics = (...args: Parameters<typeof realApi.getTopics>) =>
  apiProxy.getTopics(...args);

export const getPosts = (...args: Parameters<typeof realApi.getPosts>) =>
  apiProxy.getPosts(...args);

export const getLatestPosts = (
  ...args: Parameters<typeof realApi.getLatestPosts>
) => apiProxy.getLatestPosts(...args);

export const getPostDetail = (
  ...args: Parameters<typeof realApi.getPostDetail>
) => apiProxy.getPostDetail(...args);

export const getPostComments = (
  ...args: Parameters<typeof realApi.getPostComments>
) => apiProxy.getPostComments(...args);

export const getUserDetails = (
  ...args: Parameters<typeof realApi.getUserDetails>
) => apiProxy.getUserDetails(...args);

export const updateUserProfile = (
  ...args: Parameters<typeof realApi.updateUserProfile>
) => apiProxy.updateUserProfile(...args);

export const createPost = (...args: Parameters<typeof realApi.createPost>) =>
  apiProxy.createPost(...args);

export const createComment = (
  ...args: Parameters<typeof realApi.createComment>
) => apiProxy.createComment(...args);

export const votePost = (...args: Parameters<typeof realApi.votePost>) =>
  apiProxy.votePost(...args);

export const revokeVote = (...args: Parameters<typeof realApi.revokeVote>) =>
  apiProxy.revokeVote(...args);

export const deletePost = (...args: Parameters<typeof realApi.deletePost>) =>
  apiProxy.deletePost(...args);

export const deleteComment = (
  ...args: Parameters<typeof realApi.deleteComment>
) => apiProxy.deleteComment(...args);

export const updatePost = (...args: Parameters<typeof realApi.updatePost>) =>
  apiProxy.updatePost(...args);

export const getUnreadNotifications = (
  ...args: Parameters<typeof realApi.getUnreadNotifications>
) => apiProxy.getUnreadNotifications(...args);

export const getUnreadNotificationsCount = (
  ...args: Parameters<typeof realApi.getUnreadNotificationsCount>
) => apiProxy.getUnreadNotificationsCount(...args);

export const markNotificationAsRead = (
  ...args: Parameters<typeof realApi.markNotificationAsRead>
) => apiProxy.markNotificationAsRead(...args);

export const markAllNotificationsAsRead = (
  ...args: Parameters<typeof realApi.markAllNotificationsAsRead>
) => apiProxy.markAllNotificationsAsRead(...args);

export const deleteNotification = (
  ...args: Parameters<typeof realApi.deleteNotification>
) => apiProxy.deleteNotification(...args);

export const deleteAllNotifications = (
  ...args: Parameters<typeof realApi.deleteAllNotifications>
) => apiProxy.deleteAllNotifications(...args);

export const getCommentDetails = (
  ...args: Parameters<typeof realApi.getCommentDetails>
) => apiProxy.getCommentDetails(...args);

export const login = (...args: Parameters<typeof realApi.login>) =>
  apiProxy.login(...args);
