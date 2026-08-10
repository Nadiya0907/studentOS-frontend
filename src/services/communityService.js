import api, { USE_MOCK_API } from './api';
import { mockClient } from './mockClient';
export const communityService = {
  getPosts: () => USE_MOCK_API ? mockClient.posts() : api.get('/posts'),
  createPost: (data) => USE_MOCK_API ? Promise.resolve({ data: { id: Date.now(), ...data } }) : api.post('/posts', data),
  updatePost: (id, data) => USE_MOCK_API ? Promise.resolve({ data: { id, ...data } }) : api.put(`/posts/${id}`, data),
  deletePost: (id) => USE_MOCK_API ? Promise.resolve({ data: { id } }) : api.delete(`/posts/${id}`),
  addComment: (postId, data) => USE_MOCK_API ? Promise.resolve({ data: { postId, ...data } }) : api.post('/comments', { postId, ...data }),
  deleteComment: (commentId) => USE_MOCK_API ? Promise.resolve({ data: { commentId } }) : api.delete('/comments', { data: { commentId } }),
  likePost: (postId) => USE_MOCK_API ? Promise.resolve({ data: { postId } }) : api.post('/likes', { postId }),
};
