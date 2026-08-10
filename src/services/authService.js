import api, { USE_MOCK_API } from './api';

const demoUser = (data) => ({
  id: 'demo-user',
  name: data.name || 'Nadz',
  email: data.email || 'student@example.com',
  role: data.email === 'admin@studentos.local' ? 'admin' : 'student',
});

export const authService = {
  signup: async (data) => {
    if (USE_MOCK_API) return { data: { message: 'Account created', user: demoUser(data) } };
    return api.post('/signup', data);
  },
  login: async (data) => {
    if (USE_MOCK_API) return { data: { token: 'demo-jwt-token', user: demoUser(data) } };
    return api.post('/login', data);
  },
  logout: async () => {
    localStorage.removeItem('studentos_token');
    localStorage.removeItem('studentos_user');
    if (!USE_MOCK_API) {
      try { await api.post('/logout'); } catch { /* local logout still succeeds */ }
    }
  },
  forgotPassword: (data) => USE_MOCK_API ? Promise.resolve({ data: { message: 'Reset link sent' } }) : api.post('/forgot-password', data),
  verifyEmail: (data) => USE_MOCK_API ? Promise.resolve({ data: { message: 'Email verified' } }) : api.post('/verify-email', data),
  getProfile: () => USE_MOCK_API ? Promise.resolve({ data: demoUser({}) }) : api.get('/profile'),
};
