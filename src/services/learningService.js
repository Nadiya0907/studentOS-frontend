
import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

const call = (mock, real) =>
  USE_MOCK_API ? mock() : real();

export const learningService = {
  // Academic resources / notes
  getNotes: () =>
    call(
      mockClient.notes,
      () => api.get("/academic/resources")
    ),

  // The backend currently exposes GET only for resources.
  // Keep these methods for frontend compatibility until
  // create/update/delete resource endpoints are added.
  createNote: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : Promise.reject(
          new Error("Create resource endpoint is not available")
        ),

  updateNote: (id, data) =>
    USE_MOCK_API
      ? Promise.resolve({ data: { id, ...data } })
      : Promise.reject(
          new Error("Update resource endpoint is not available")
        ),

  deleteNote: (id) =>
    USE_MOCK_API
      ? Promise.resolve({ data: { id } })
      : Promise.reject(
          new Error("Delete resource endpoint is not available")
        ),

  // Subjects
  getSubjects: () =>
    call(
      mockClient.subjects,
      () => api.get("/subjects/")
    ),

  // Previous year papers
  getPyqs: () =>
    call(
      mockClient.pyqs,
      () => api.get("/pyqs/")
    ),

  createPyq: (data) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : Promise.reject(
          new Error("Create PYQ endpoint is not available")
        ),

  // Videos
  getVideos: () =>
    call(
      mockClient.videos,
      () => api.get("/videos/")
    ),
};