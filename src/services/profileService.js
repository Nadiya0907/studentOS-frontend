import api, { USE_MOCK_API } from './api';
import { mockClient } from './mockClient';
export const profileService = {
  getProfile: () =>
    USE_MOCK_API
      ? mockClient.profile()
      : api.get('/student/me'),

  updateProfile: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.put('/student/me', data),

  uploadPhoto: (formData) =>
    USE_MOCK_API
      ? Promise.resolve({ data: { url: '#' } })
      : api.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
};
export const notificationService = {
  getNotifications: () =>
    USE_MOCK_API
      ? mockClient.notifications()
      : api.get('/notifications'),

  createNotification: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.post('/notifications', data),

  deleteNotification: (id) =>
    USE_MOCK_API
      ? Promise.resolve({ data: { id } })
      : api.delete('/notifications', {
          data: { id },
        }),
};