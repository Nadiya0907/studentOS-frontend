import api, { USE_MOCK_API } from './api';
import { mockClient } from './mockClient';
export const profileService = {
  getProfile: () => USE_MOCK_API ? mockClient.profile() : api.get('/profile'),
  updateProfile: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.put('/profile', data),
  uploadPhoto: (formData) => USE_MOCK_API ? Promise.resolve({ data: { url: '#'} }) : api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
export const notificationService = {
  getNotifications: () => USE_MOCK_API ? mockClient.notifications() : api.get('/notifications'),
  createNotification: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.post('/notifications', data),
  deleteNotification: (id) => USE_MOCK_API ? Promise.resolve({ data: { id } }) : api.delete('/notifications', { data: { id } }),
};
export const uploadService = {
  image: (formData) => USE_MOCK_API ? Promise.resolve({ data: { url: '#' } }) : api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  pdf: (formData) => USE_MOCK_API ? Promise.resolve({ data: { url: '#' } }) : api.post('/upload/pdf', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  resume: (formData) => USE_MOCK_API ? Promise.resolve({ data: { url: '#' } }) : api.post('/upload/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.delete('/upload', { data }),
};
