import api, { USE_MOCK_API } from './api';
import { mockClient } from './mockClient';
const call = (mock, real) => USE_MOCK_API ? mock() : real();
export const learningService = {
  getNotes: () => call(mockClient.notes, () => api.get('/notes')),
  createNote: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.post('/notes', data),
  updateNote: (id, data) => USE_MOCK_API ? Promise.resolve({ data: { id, ...data } }) : api.put('/notes', { id, ...data }),
  deleteNote: (id) => USE_MOCK_API ? Promise.resolve({ data: { id } }) : api.delete('/notes', { data: { id } }),
  getSubjects: () => call(mockClient.subjects, () => api.get('/subjects')),
  getPyqs: () => call(mockClient.pyqs, () => api.get('/pyqs')),
  createPyq: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.post('/pyqs', data),
  getVideos: () => call(mockClient.videos, () => api.get('/videos')),
};
