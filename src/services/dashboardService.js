import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

const call = (mock, real) =>
  USE_MOCK_API ? mock() : real();

export const dashboardService = {
  // ---------------------------------------
  // DASHBOARD
  // ---------------------------------------

  getDashboard: (rollNumber) =>
    call(
      mockClient.dashboard,
      () =>
        api.get(
          `/dashboard/${rollNumber}`
        )
    ),

  // ---------------------------------------
  // ATTENDANCE
  // ---------------------------------------

  getAttendance: (rollNumber) =>
    call(
      mockClient.attendance,
      () =>
        api.get(
          `/attendance/student/${rollNumber}`
        )
    ),

  getAttendanceStats: (rollNumber) =>
    USE_MOCK_API
      ? mockClient.attendance()
      : api.get(
          `/attendance/stats/${rollNumber}`
        ),

  postAttendance: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.post(
          "/attendance/mark",
          data
        ),

  postBulkAttendance: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.post(
          "/attendance/mark-bulk",
          data
        ),

  // ---------------------------------------
  // CGPA
  // ---------------------------------------

  getCgpa: () =>
    USE_MOCK_API
      ? Promise.resolve({
          data: { cgpa: 8.6 },
        })
      : api.get("/dashboard/cgpa"),

  postCgpa: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.post(
          "/dashboard/cgpa",
          data
        ),

  // ---------------------------------------
  // GOALS
  // ---------------------------------------

  getGoals: () =>
    USE_MOCK_API
      ? Promise.resolve({
          data: [],
        })
      : api.get("/dashboard/goals"),

  createGoal: (data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: data,
        })
      : api.post(
          "/dashboard/goals",
          data
        ),

  updateGoal: (goalId, data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            id: goalId,
            ...data,
          },
        })
      : api.put(
          `/dashboard/goals/${goalId}`,
          data
        ),

  deleteGoal: (goalId) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: { id: goalId },
        })
      : api.delete(
          `/dashboard/goals/${goalId}`
        ),

  // ---------------------------------------
  // STREAK
  // ---------------------------------------

  getStreak: () =>
    USE_MOCK_API
      ? Promise.resolve({
          data: { streak: 12 },
        })
      : api.get("/dashboard/streak"),

  postStreak: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.post(
          "/dashboard/streak",
          data
        ),
};