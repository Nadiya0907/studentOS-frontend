import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

export const communityService = {
  // -----------------------------
  // POSTS
  // -----------------------------

  getPosts: () =>
    USE_MOCK_API
      ? mockClient.posts()
      : api.get("/community/posts"),

  createPost: (data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            id: Date.now(),
            ...data,
          },
        })
      : api.post("/community/posts", data),

  updatePost: (id, data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            id,
            ...data,
          },
        })
      : api.put(`/community/posts/${id}`, data),

  deletePost: (id) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: { id },
        })
      : api.delete(`/community/posts/${id}`),

  // -----------------------------
  // COMMENTS
  // -----------------------------

  addComment: (postId, data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            post_id: postId,
            ...data,
          },
        })
      : api.post("/community/comments", {
          post_id: postId,
          commenter: data.commenter,
          text: data.text,
        }),

  deleteComment: (commentId) =>
  USE_MOCK_API
    ? Promise.resolve({
        data: { id: commentId },
      })
    : api.delete(
        `/community/comments/${commentId}`
      ),

  // -----------------------------
  // LIKES
  // -----------------------------

  likePost: (postId, username) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            post_id: postId,
            username,
          },
        })
      : api.post("/community/likes", {
          post_id: postId,
          username,
        }),
};