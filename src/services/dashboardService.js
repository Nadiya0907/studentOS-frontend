import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

const call = (mock, real) =>
  USE_MOCK_API ? mock() : real();

export const dashboardService = {
  // Dashboard
  getDashboard: (rollNumber) =>
    call(
      mockClient.dashboard,
      () => api.get(`/dashboard/${rollNumber}`)
    ),

  // Attendance
    // Attendance
getAttendance: (rollNumber) =>
  call(
    mockClient.attendance,
    () => api.get(`/attendance/student/${rollNumber}`)
  ),

getAttendanceStats: (rollNumber) =>
  USE_MOCK_API
    ? mockClient.attendance()
    : api.get(`/attendance/stats/${rollNumber}`),

postAttendance: (data) =>
  USE_MOCK_API
    ? Promise.resolve({ data })
    : api.post("/attendance/mark", data),
  // CGPA
  getCgpa: () =>
    call(
      mockClient.cgpa,
      () => api.get(`/cgpa`)
    ),

  postCgpa: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.post("/cgpa", data),

  // Goals
  getGoals: () =>
    call(
      mockClient.goals,
      () => api.get(`/goals`)
    ),

  createGoal: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.post("/goals", data),

  updateGoal: (id, data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            id,
            ...data,
          },
        })
      : api.put(`/goals/${id}`, data),

  deleteGoal: (id) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: { id },
        })
      : api.delete(`/goals/${id}`),

  // Streak
  getStreak: () =>
    call(
      mockClient.streak,
      () => api.get(`/streak`)
    ),
  postStreak: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.post("/streak", data),
};
