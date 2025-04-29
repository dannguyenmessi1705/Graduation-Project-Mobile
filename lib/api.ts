import * as SecureStore from "expo-secure-store";
import type { UserInfo } from "../types/UserData";
import type { TopicData } from "../types/TopicData";
import type { PostData, PostDetailData, CommentData } from "../types/PostData";
import type { NotificationResponse } from "../types/NotificationData";

import { API_BASE_URL } from "./env";

export async function apiRequest(
  url: string,
  options: RequestInit = {},
  requiresAuth = false
) {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (requiresAuth) {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      throw new Error("TokenExpiredError");
    }

    if (!response.ok) {
      throw new Error("ApiError");
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

export async function getUserInfo(): Promise<UserInfo> {
  const response = await apiRequest(`${API_BASE_URL}/users/me`, {}, true);
  return response.data;
}

export async function getTopics(page = 0): Promise<{ data: TopicData[] }> {
  return apiRequest(`${API_BASE_URL}/topics?page=${page}`);
}

export async function getPosts(
  topicId: string,
  page = 0
): Promise<{ data: PostData[] }> {
  return apiRequest(
    `${API_BASE_URL}/posts/topic/${topicId}?type=new&page=${page}`
  );
}

export async function getLatestPosts(page = 0): Promise<{ data: PostData[] }> {
  return apiRequest(`${API_BASE_URL}/posts/?searchType=new&page=${page}`);
}

export async function getPostDetail(
  postId: string
): Promise<{ data: PostDetailData }> {
  return apiRequest(`${API_BASE_URL}/posts/${postId}`);
}

export async function getPostComments(
  postId: string,
  page = 0
): Promise<{ data: CommentData[] }> {
  return apiRequest(`${API_BASE_URL}/comments/post/${postId}?page=${page}`);
}

export async function getUserDetails(userId: string): Promise<{ data: any }> {
  return apiRequest(`${API_BASE_URL}/users/${userId}`);
}

export async function updateUserProfile(formData: FormData): Promise<any> {
  const token = await SecureStore.getItemAsync("token");

  return fetch(`${API_BASE_URL}/users/update/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to update profile");
    }
    return response.json();
  });
}

export async function createPost(
  topicId: string,
  title: string,
  content: string,
  files: Array<{ uri: string; name: string; type: string }> = []
): Promise<any> {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("topicId", topicId);

  files.forEach((file, index) => {
    formData.append("files", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
  });

  const token = await SecureStore.getItemAsync("token");

  return fetch(`${API_BASE_URL}/posts/new`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to create post");
    }
    return response.json();
  });
}

export async function createComment(
  postId: string,
  content: string,
  replyToCommentId?: string
): Promise<any> {
  const body: any = { content, postId };
  if (replyToCommentId) {
    body.replyToCommentId = replyToCommentId;
  }

  return apiRequest(
    `${API_BASE_URL}/comments/create`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    true
  );
}

export async function votePost(
  postId: string,
  voteType: "up" | "down"
): Promise<void> {
  await apiRequest(
    `${API_BASE_URL}/posts/votes/add/${postId}?type=${voteType}`,
    { method: "POST" },
    true
  );
}

export async function revokeVote(
  type: "post" | "comment",
  id: string
): Promise<void> {
  await apiRequest(
    `${API_BASE_URL}/${type}s/votes/revoke/${id}`,
    { method: "DELETE" },
    true
  );
}

export async function deletePost(postId: string): Promise<void> {
  await apiRequest(
    `${API_BASE_URL}/posts/${postId}`,
    { method: "DELETE" },
    true
  );
}

export async function deleteComment(commentId: string): Promise<void> {
  await apiRequest(
    `${API_BASE_URL}/comments/${commentId}`,
    { method: "DELETE" },
    true
  );
}

export async function updatePost(
  postId: string,
  formData: FormData
): Promise<any> {
  const token = await SecureStore.getItemAsync("token");

  return fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    return response.json();
  });
}

export async function getUnreadNotifications(): Promise<NotificationResponse> {
  return apiRequest(`${API_BASE_URL}/notifications/unread`, {}, true);
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const response = await apiRequest(
    `${API_BASE_URL}/notifications/unread/count`,
    {},
    true
  );
  return response;
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  await apiRequest(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    { method: "PUT" },
    true
  );
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiRequest(
    `${API_BASE_URL}/notifications/read/all`,
    { method: "PUT" },
    true
  );
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  await apiRequest(
    `${API_BASE_URL}/notifications/${notificationId}`,
    { method: "DELETE" },
    true
  );
}

export async function deleteAllNotifications(): Promise<void> {
  await apiRequest(
    `${API_BASE_URL}/notifications/all`,
    { method: "DELETE" },
    true
  );
}

export async function getCommentDetails(
  commentId: string
): Promise<{ data: any }> {
  return apiRequest(`${API_BASE_URL}/comments/${commentId}`);
}

export async function login(
  username: string,
  password: string
): Promise<{ data: { access_token: string } }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
