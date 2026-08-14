import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

const call = (mock, real) =>
  USE_MOCK_API ? mock() : real();

export const dashboardService = {
  getDashboard: (rollNumber) =>
    call(
      mockClient.dashboard,
      () => api.get(`/dashboard/${rollNumber}`)
    ),

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
};
