import api, { USE_MOCK_API } from './api';
import { mockClient } from './mockClient';
const call = (mock, real) => USE_MOCK_API ? mock() : real();
const upload = (url, formData) => USE_MOCK_API ? Promise.resolve({ data: { url: '#', message: 'Demo upload complete' } }) : api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const placementService = {
  getCompanies: () => call(mockClient.companies, () => api.get('/companies')),
  createCompany: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.post('/companies', data),
  getJobs: () => call(mockClient.jobs, () => api.get('/jobs')),
  createJob: (data) => USE_MOCK_API ? Promise.resolve({ data }) : api.post('/jobs', data),
  getInternships: () => call(mockClient.internships, () => api.get('/internships')),
  uploadResume: (formData) => upload('/resume', formData),
  getResume: () => USE_MOCK_API ? Promise.resolve({ data: { name: 'Nadz_Resume.pdf', atsScore: 82 } }) : api.get('/resume'),
};
