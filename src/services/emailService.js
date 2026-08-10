import api, { USE_MOCK_API } from './api';
export const emailService = {
  sendEmail: (data) => USE_MOCK_API ? Promise.resolve({ data: { message: 'Demo email queued' } }) : api.post('/send-email', data),
  verifyEmail: (data) => USE_MOCK_API ? Promise.resolve({ data: { message: 'Demo verification sent' } }) : api.post('/verify-email', data),
};
