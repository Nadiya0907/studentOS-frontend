import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

const call = (mock, real) =>
  USE_MOCK_API ? mock() : real();

const upload = (url, formData) =>
  USE_MOCK_API
    ? Promise.resolve({
        data: {
          url: "#",
          message: "Demo upload complete",
        },
      })
    : api.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

export const placementService = {
  getJobs: () =>
    call(
      mockClient.jobs,
      () => api.get("/jobs/all")
    ),

  createJob: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.post("/jobs/create", data),

  getJob: (jobId) =>
    USE_MOCK_API
      ? Promise.resolve({ data: {} })
      : api.get(`/jobs/${jobId}`),

  uploadResume: (formData) =>
    upload("/upload/resume", formData),
};