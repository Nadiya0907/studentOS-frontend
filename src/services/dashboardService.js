import api, { USE_MOCK_API } from './api';
import { mockClient } from './mockClient';
const call = (mock, real) => USE_MOCK_API ? mock() : real();
export const dashboardService = {
  getDashboard: () => call(mockClient.dashboard, () => api.get('/dashboard')),
  getAttendance: () => call(mockClient.attendance, () => api.get('/attendance')),
  postAttendance: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.post('/attendance', data),
  getCgpa: () => call(mockClient.cgpa, () => api.get('/cgpa')),
  postCgpa: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.post('/cgpa', data),
  getGoals: () => call(mockClient.goals, () => api.get('/goals')),
  createGoal: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.post('/goals', data),
  updateGoal: (id, data) => USE_MOCK_API ? Promise.resolve({ data: { id, ...data } }) : api.put(`/goals/${id}`, data),
  deleteGoal: (id) => USE_MOCK_API ? Promise.resolve({ data: { id } }) : api.delete(`/goals/${id}`),
  getStreak: () => call(mockClient.streak, () => api.get('/streak')),
  postStreak: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.post('/streak', data),
};
