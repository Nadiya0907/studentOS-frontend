/* import api, { USE_MOCK_API } from './api';
import { mockClient } from './mockClient';
export const adminService = {
  getUsers: () => USE_MOCK_API ? mockClient.adminUsers() : api.get('/admin/users'),
  deleteUser: (id) => USE_MOCK_API ? Promise.resolve({ data: { id } }) : api.delete('/admin/users', { data: { id } }),
  getReports: () => USE_MOCK_API ? mockClient.adminReports() : api.get('/admin/reports'),
  getStatistics: () => USE_MOCK_API ? mockClient.adminStatistics() : api.get('/admin/statistics'),
  getFeedback: () => USE_MOCK_API ? mockClient.adminFeedback() : api.get('/admin/feedback'),
};
 */
import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

export const adminService = {
  getUsers: () =>
    USE_MOCK_API
      ? mockClient.adminUsers()
      : api.get("/admin/users"),

  getReports: () =>
    USE_MOCK_API
      ? mockClient.adminReports()
      : api.get("/admin/reports"),

  getStatistics: () =>
    USE_MOCK_API
      ? mockClient.adminStatistics()
      : api.get("/admin/analytics"),

  getFeedback: () =>
    USE_MOCK_API
      ? mockClient.adminFeedback()
      : api.get("/admin/feedback"),

 // Kept because this feature is part of the roadmap.
  // Current backend may return 404 until your teammate implements it.
  deleteUser: (id) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: { id },
        })
      : api.delete("/admin/users", {
          data: { id },
        }),
};
