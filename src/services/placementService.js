import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

const call = (mock, real) =>
  USE_MOCK_API ? mock() : real();

export const placementService = {
  // ---------------------------------
  // JOBS
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

  getCompanies: () =>
    USE_MOCK_API
      ? mockClient.companies()
      : api.get("/companies"),

  createCompany: (data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            id: Date.now(),
            ...data,
          },
        })
      : api.post("/companies", data),

  deleteCompany: (companyId) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: { id: companyId },
        })
      : api.delete(
          `/companies/${companyId}`
        ),

  // ---------------------------------
  // INTERNSHIPS
  // ---------------------------------

  getInternships: () =>
    USE_MOCK_API
      ? mockClient.internships()
      : api.get("/internships"),

  createInternship: (data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            id: Date.now(),
            ...data,
          },
        })
      : api.post("/internships", data),

  deleteInternship: (internshipId) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: { id: internshipId },
        })
      : api.delete(
          `/internships/${internshipId}`
        ),

  // ---------------------------------
  // RESUME UPLOAD
  // ---------------------------------

  uploadResume: (formData) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            message:
              "Demo resume upload complete",
            url: "#",
          },
        })
      : api.post(
          "/upload/resume",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        ),
};