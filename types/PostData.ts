export interface Author {
  id: string;
  username: string;
}

export interface PostData {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  totalComments: number;
  totalUpvotes: number;
  totalDownvotes: number;
  topicId: string;
  fileAttachments: string[];
}

export interface PostDetailData extends PostData {
  // Additional fields specific to post detail
}

export interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  postId: string;
  replyToCommentId: string | null;
  totalUpvotes: number;
  totalDownvotes: number;
}
