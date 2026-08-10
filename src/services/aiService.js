import api, { USE_MOCK_API } from './api';
import { mockClient } from './mockClient';
const ask = (message, module, endpoint, payload = { message }) => USE_MOCK_API ? mockClient.ai(message, module) : api.post(endpoint, payload);
export const aiService = {
  askMentor: (message) => ask(message, 'Academic Mentor', '/ai/mentor'),
  askCareer: (payload) => ask(payload.message || 'career guidance', 'Career Mentor', '/ai/career', payload),
  reviewResume: (formData) => USE_MOCK_API ? mockClient.ai('resume review', 'Resume Reviewer') : api.post('/ai/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  askEnglishCoach: (payload) => ask(payload.message || 'English practice', 'English Coach', '/ai/english', payload),
  askProjectMentor: (payload) => ask(payload.message || 'project guidance', 'Project Mentor', '/ai/project', payload),
};
