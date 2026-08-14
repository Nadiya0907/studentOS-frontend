import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

const call = (mock, real) =>
  USE_MOCK_API ? mock() : real();

export const placementService = {
  // ---------------------------------
  // JOBS - CURRENT BACKEND SUPPORT
  // ---------------------------------

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

  // ---------------------------------
  // COMPANIES
  // ---------------------------------
  // Keep this feature because it exists
  // in the frontend. The current backend
  // code does not provide this endpoint yet.

  getCompanies: () =>
    USE_MOCK_API
      ? mockClient.companies()
      : api.get("/companies"),

  // ---------------------------------
  // INTERNSHIPS
  // ---------------------------------
  // Keep this feature because it exists
  // in the frontend. The current backend
  // code does not provide this endpoint yet.

  getInternships: () =>
    USE_MOCK_API
      ? mockClient.internships()
      : api.get("/internships"),

  // ---------------------------------
  // RESUME UPLOAD
  // ---------------------------------
  // Keep this feature because it exists
  // in the frontend. The current backend
  // code does not currently provide
  // /upload/resume.

  uploadResume: (formData) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            message: "Demo resume upload complete",
            url: "#",
          },
        })
      : api.post("/upload/resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
};