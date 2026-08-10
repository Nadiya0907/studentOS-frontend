import {
  mockAdmin, mockDashboard, mockLearning, mockNotifications, mockPlacement, mockPosts, mockProfile,
} from './mockData';

const clone = (value) => JSON.parse(JSON.stringify(value));
const response = (data) => Promise.resolve({ data: clone(data) });

export const mockClient = {
  dashboard: () => response(mockDashboard),
  attendance: () => response({ attendance: mockDashboard.attendance }),
  cgpa: () => response({ cgpa: mockDashboard.cgpa }),
  goals: () => response(mockDashboard.goals),
  streak: () => response({ streak: mockDashboard.streak }),
  notes: () => response(mockLearning.notes),
  subjects: () => response(mockLearning.subjects),
  pyqs: () => response(mockLearning.pyqs),
  videos: () => response(mockLearning.videos),
  companies: () => response(mockPlacement.companies),
  jobs: () => response(mockPlacement.jobs),
  internships: () => response(mockPlacement.internships),
  posts: () => response(mockPosts),
  profile: () => response(mockProfile),
  notifications: () => response(mockNotifications),
  adminUsers: () => response(mockAdmin.users),
  adminReports: () => response(mockAdmin.reports),
  adminStatistics: () => response(mockAdmin.reports),
  adminFeedback: () => response(mockAdmin.feedback),
  ai: (message, module) => response({ reply: `[Demo ${module}] I received: “${message}”. Connect the FastAPI backend to receive the real AI response.` }),
};
