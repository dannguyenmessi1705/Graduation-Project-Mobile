import type { UserInfo } from "../types/UserData";
import type { TopicData } from "../types/TopicData";
import type { PostData, PostDetailData, CommentData } from "../types/PostData";
import type {
  NotificationResponse,
  Notification,
} from "../types/NotificationData";
import { mockUsers, mockTopics, mockPosts } from "./mockData";

// Create mock post details from mock posts
const mockPostDetails: Record<string, PostDetailData> = {};
mockPosts.forEach((post) => {
  mockPostDetails[post.id] = {
    ...post,
    // Add any additional fields specific to post detail if needed
  };
});

// Mock Comment Data
const mockComments: Record<string, CommentData[]> = {
  "1": [
    {
      id: "1-1",
      content: "Great post! This helped me get started with React Native.",
      createdAt: "2023-04-20T11:45:00Z",
      updatedAt: "2023-04-20T11:45:00Z",
      author: { id: "2", username: "janedoe" },
      postId: "1",
      replyToCommentId: null,
      totalUpvotes: 3,
      totalDownvotes: 0,
    },
    {
      id: "1-2",
      content:
        "Do you have any recommendations for state management with React Native?",
      createdAt: "2023-04-20T12:30:00Z",
      updatedAt: "2023-04-20T12:30:00Z",
      author: { id: "3", username: "bobsmith" },
      postId: "1",
      replyToCommentId: null,
      totalUpvotes: 2,
      totalDownvotes: 0,
    },
    {
      id: "1-3",
      content: "I'd recommend Redux or MobX, depending on your project size.",
      createdAt: "2023-04-20T12:45:00Z",
      updatedAt: "2023-04-20T12:45:00Z",
      author: { id: "1", username: "johndoe" },
      postId: "1",
      replyToCommentId: "1-2",
      totalUpvotes: 4,
      totalDownvotes: 0,
    },
  ],
  "2": [
    {
      id: "2-1",
      content:
        "I've been using TypeScript for years and learned some new tricks from this post!",
      createdAt: "2023-04-18T15:10:00Z",
      updatedAt: "2023-04-18T15:10:00Z",
      author: { id: "3", username: "bobsmith" },
      postId: "2",
      replyToCommentId: null,
      totalUpvotes: 5,
      totalDownvotes: 0,
    },
    {
      id: "2-2",
      content: "Could you elaborate more on the utility types section?",
      createdAt: "2023-04-18T16:22:00Z",
      updatedAt: "2023-04-18T16:22:00Z",
      author: { id: "1", username: "johndoe" },
      postId: "2",
      replyToCommentId: null,
      totalUpvotes: 2,
      totalDownvotes: 0,
    },
  ],
  "3": [
    {
      id: "3-1",
      content:
        "I find Grid better for overall layouts and Flexbox better for component alignment.",
      createdAt: "2023-04-15T10:20:00Z",
      updatedAt: "2023-04-15T10:20:00Z",
      author: { id: "1", username: "johndoe" },
      postId: "3",
      replyToCommentId: null,
      totalUpvotes: 7,
      totalDownvotes: 1,
    },
  ],
  "4": [
    {
      id: "4-1",
      content: "A/B testing has been incredibly valuable for our team.",
      createdAt: "2023-04-12T18:05:00Z",
      updatedAt: "2023-04-12T18:05:00Z",
      author: { id: "3", username: "bobsmith" },
      postId: "4",
      replyToCommentId: null,
      totalUpvotes: 4,
      totalDownvotes: 0,
    },
  ],
  "5": [
    {
      id: "5-1",
      content:
        "TensorFlow can be intimidating at first but this breaks it down nicely.",
      createdAt: "2023-04-10T14:30:00Z",
      updatedAt: "2023-04-10T14:30:00Z",
      author: { id: "2", username: "janedoe" },
      postId: "5",
      replyToCommentId: null,
      totalUpvotes: 3,
      totalDownvotes: 0,
    },
  ],
  "6": [
    {
      id: "6-1",
      content:
        "This is exactly what I needed for setting up my CI/CD pipeline. Thanks!",
      createdAt: "2023-04-05T13:15:00Z",
      updatedAt: "2023-04-05T13:15:00Z",
      author: { id: "4", username: "alicegreen" },
      postId: "6",
      replyToCommentId: null,
      totalUpvotes: 5,
      totalDownvotes: 0,
    },
  ],
  "7": [
    {
      id: "7-1",
      content:
        "Great explanation of blockchain fundamentals. Very clear and concise.",
      createdAt: "2023-03-28T11:20:00Z",
      updatedAt: "2023-03-28T11:20:00Z",
      author: { id: "1", username: "johndoe" },
      postId: "7",
      replyToCommentId: null,
      totalUpvotes: 6,
      totalDownvotes: 0,
    },
  ],
  "8": [
    {
      id: "8-1",
      content:
        "The project organization tips are really helpful. I'm implementing them in my game right now.",
      createdAt: "2023-03-22T10:45:00Z",
      updatedAt: "2023-03-22T10:45:00Z",
      author: { id: "5", username: "mikebrown" },
      postId: "8",
      replyToCommentId: null,
      totalUpvotes: 4,
      totalDownvotes: 0,
    },
  ],
};

// Mock Notifications
const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: "1",
    title: "New Comment",
    content:
      "Jane Doe commented on your post 'Getting started with React Native'",
    type: "comment",
    link: "/posts/1",
    isRead: false,
    createdAt: "2023-04-20T11:45:00Z",
    updatedAt: null,
  },
  {
    id: 2,
    userId: "1",
    title: "New Upvote",
    content: "Bob Smith upvoted your post 'Introduction to TensorFlow'",
    type: "upvote",
    link: "/posts/5",
    isRead: false,
    createdAt: "2023-04-20T09:15:00Z",
    updatedAt: null,
  },
  {
    id: 3,
    userId: "2",
    title: "Comment Reply",
    content:
      "John Doe replied to your comment on 'Advanced TypeScript Patterns'",
    type: "reply",
    link: "/posts/2",
    isRead: true,
    createdAt: "2023-04-19T14:30:00Z",
    updatedAt: "2023-04-19T15:10:00Z",
  },
  {
    id: 4,
    userId: "1",
    title: "New Follower",
    content: "Alice Green is now following you",
    type: "follow",
    link: "/users/4",
    isRead: false,
    createdAt: "2023-04-18T08:45:00Z",
    updatedAt: null,
  },
  {
    id: 5,
    userId: "3",
    title: "Post Mention",
    content: "You were mentioned in a post by Mike Brown",
    type: "mention",
    link: "/posts/8",
    isRead: false,
    createdAt: "2023-04-17T16:30:00Z",
    updatedAt: null,
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export async function getUserInfo(): Promise<UserInfo> {
  await delay(300);
  // We'll assume user 1 is the logged in user
  return mockUsers[0];
}

export async function getTopics(page = 0): Promise<{ data: TopicData[] }> {
  await delay(300);
  const pageSize = 10;
  const start = page * pageSize;
  const end = start + pageSize;
  const paginatedTopics = mockTopics.slice(start, end);
  return { data: paginatedTopics };
}

export async function getPosts(
  topicId: string,
  page = 0
): Promise<{ data: PostData[] }> {
  await delay(300);
  const pageSize = 10;
  const filteredPosts = mockPosts.filter((post) => post.topicId === topicId);
  const start = page * pageSize;
  const end = start + pageSize;
  const paginatedPosts = filteredPosts.slice(start, end);
  return { data: paginatedPosts };
}

export async function getLatestPosts(page = 0): Promise<{ data: PostData[] }> {
  await delay(300);
  const pageSize = 10;
  const sortedPosts = [...mockPosts].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const start = page * pageSize;
  const end = start + pageSize;
  const paginatedPosts = sortedPosts.slice(start, end);
  return { data: paginatedPosts };
}

export async function getPostDetail(
  postId: string
): Promise<{ data: PostDetailData }> {
  await delay(300);
  const post = mockPostDetails[postId];
  if (!post) {
    throw new Error("Post not found");
  }
  return { data: post };
}

export async function getPostComments(
  postId: string,
  page = 0
): Promise<{ data: CommentData[] }> {
  await delay(300);
  const pageSize = 10;
  const comments = mockComments[postId] || [];
  const start = page * pageSize;
  const end = start + pageSize;
  const paginatedComments = comments.slice(start, end);
  return { data: paginatedComments };
}

export async function getUserDetails(
  userId: string
): Promise<{ data: UserInfo }> {
  await delay(300);
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  return { data: user };
}

export async function updateUserProfile(formData: FormData): Promise<any> {
  await delay(500);
  // Simulate profile update
  const userData = mockUsers[0];

  // Update the user data with formData values
  // This is just mocking the update, not actually changing the mockUsers array
  return {
    status: "success",
    message: "Profile updated successfully",
    data: userData,
  };
}

export async function createPost(
  topicId: string,
  title: string,
  content: string,
  files: Array<{ uri: string; name: string; type: string }> = []
): Promise<any> {
  await delay(500);

  // Create a new post ID (would be generated by the server in real API)
  const newId = (mockPosts.length + 1).toString();

  const fileAttachments = files.map((file) => file.uri);

  const newPost: PostData = {
    id: newId,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: "1", username: "johndoe" }, // Current logged in user
    totalComments: 0,
    totalUpvotes: 0,
    totalDownvotes: 0,
    topicId,
    fileAttachments,
  };

  // In a real implementation, we would add this to the mock posts array
  // mockPosts.push(newPost);

  return {
    status: "success",
    message: "Post created successfully",
    data: newPost,
  };
}

export async function createComment(
  postId: string,
  content: string,
  replyToCommentId?: string
): Promise<any> {
  await delay(300);

  const postComments = mockComments[postId] || [];
  const newId = `${postId}-${postComments.length + 1}`;

  const newComment: CommentData = {
    id: newId,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: "1", username: "johndoe" }, // Current logged in user
    postId,
    replyToCommentId: replyToCommentId || null,
    totalUpvotes: 0,
    totalDownvotes: 0,
  };

  // In a real implementation, we would add this to the comments
  // if (!mockComments[postId]) {
  //   mockComments[postId] = [];
  // }
  // mockComments[postId].push(newComment);

  return {
    status: "success",
    message: "Comment created successfully",
    data: newComment,
  };
}

export async function votePost(
  postId: string,
  voteType: "up" | "down"
): Promise<void> {
  await delay(200);
  // Simulate voting without actually changing the mock data
  return;
}

export async function revokeVote(
  type: "post" | "comment",
  id: string
): Promise<void> {
  await delay(200);
  // Simulate revoking a vote without actually changing the mock data
  return;
}

export async function deletePost(postId: string): Promise<void> {
  await delay(300);
  // Simulate post deletion without actually changing the mock data
  return;
}

export async function deleteComment(commentId: string): Promise<void> {
  await delay(300);
  // Simulate comment deletion without actually changing the mock data
  return;
}

export async function updatePost(
  postId: string,
  formData: FormData
): Promise<any> {
  await delay(500);

  const existingPost = mockPosts.find((p) => p.id === postId);
  if (!existingPost) {
    throw new Error("Post not found");
  }

  // In a real implementation, we would update the existing post
  // This just returns success without modifying the mock data

  return {
    status: "success",
    message: "Post updated successfully",
    data: existingPost,
  };
}

export async function getUnreadNotifications(): Promise<NotificationResponse> {
  await delay(300);

  const unreadNotifications = mockNotifications.filter(
    (n) => !n.isRead && n.userId === "1"
  );

  return {
    status: {
      apiPath: "/notifications/unread",
      statusCode: 200,
      message: "Success",
      timestamp: new Date().toISOString(),
    },
    data: unreadNotifications,
  };
}

export async function getUnreadNotificationsCount(): Promise<number> {
  await delay(100);

  const count = mockNotifications.filter(
    (n) => !n.isRead && n.userId === "1"
  ).length;

  return count;
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  await delay(200);
  // Simulate marking notification as read without actually changing the mock data
  return;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await delay(300);
  // Simulate marking all notifications as read without actually changing the mock data
  return;
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  await delay(200);
  // Simulate notification deletion without actually changing the mock data
  return;
}

export async function deleteAllNotifications(): Promise<void> {
  await delay(300);
  // Simulate deleting all notifications without actually changing the mock data
  return;
}

export async function getCommentDetails(
  commentId: string
): Promise<{ data: CommentData }> {
  await delay(300);

  // Find the comment in all posts' comments
  let foundComment: CommentData | undefined;

  Object.values(mockComments).forEach((commentsArray) => {
    const comment = commentsArray.find((c) => c.id === commentId);
    if (comment) {
      foundComment = comment;
    }
  });

  if (!foundComment) {
    throw new Error("Comment not found");
  }

  return { data: foundComment };
}

export async function login(
  username: string,
  password: string
): Promise<{ data: { access_token: string } }> {
  await delay(500);

  // Check if username exists in mockUsers
  const user = mockUsers.find((u) => u.username === username);

  // For mock purposes, we'll accept any password for valid usernames,
  // but in a real implementation you'd check the password too
  if (!user) {
    throw new Error("Invalid username or password");
  }

  // Generate a mock access token
  const access_token = `mock_token_${user.id}_${Date.now()}`;

  return {
    data: {
      access_token,
    },
  };
}
