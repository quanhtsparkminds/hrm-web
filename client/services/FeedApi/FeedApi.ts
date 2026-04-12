import { request } from '@/lib/axios';
import { PostCriteria, TPost, CreateCommentRequest, TComment } from './FeedApi.types';

/**
 * Service for handling all feed/forum-related API calls.
 */
export const FeedApi = {
  /**
   * Fetches all posts with pagination.
   */
  getAllPosts: (criteria: PostCriteria = {}) => {
    const { page = 0, size = 20 } = criteria;
    const params = { page, size };
    return request.get<TPost[]>('/feed/posts', { params });
  },

  /**
   * Creates a new post using multipart/form-data.
   */
  createPost: (data: FormData) => {
    // Note: Axios automatically sets the correct Content-Type when using FormData
    return request.post<TPost>('/feed/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  /**
   * Adds a comment or reply to a post.
   */
  addComment: (postId: number, data: CreateCommentRequest) => {
    return request.post<TComment>(`/feed/posts/${postId}/comments`, data);
  },

  /**
   * Likes a post.
   */
  likePost: (postId: number) => {
    return request.post(`/feed/posts/${postId}/like`);
  },

  /**
   * Unlikes a post.
   */
  unlikePost: (postId: number) => {
    return request.post(`/feed/posts/${postId}/unlike`);
  },
};

export default FeedApi;
